import express from "express";
import { Stripe } from "stripe";

const app = express();
const port = 3000;

const SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;

const stripe = new Stripe(SECRET_KEY, {
  apiVersion: "2020-08-27",
});

app.use(express.json());

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

app.post("/create-payment-intent", async (request, response) => {
  const { email } = request.body;

  try {
    const ongs = [
      {
        id: "88152f5c-4037-4273-960f-47a7a0a374a5",
        name: "ONG Hállex",
        amount: 20.8 * 100,
        email: "hallex.costa@hotmail.com",
      },
    ];

    const ong = ongs.find((ong) => email === ong.email);

    if (!ong) throw new Error("ONG not found");

    const customer = await stripe.customers.create({
      name: ong.name,
      email: ong.email,
      description: "This is a customer created for API",
      metadata: {
        ong_id: ong.id,
      },
    });

    await stripe.paymentIntents.create({
      amount: ong.amount,
      currency: "brl",
      payment_method_types: ["card"],
      customer: customer.id,
      metadata: {
        incident_id: "171887c4-a799-4301-8003-7fc8a101dd02",
      },
    });

    const paymentIntents = await stripe.paymentIntents.list();

    const incident_id = "171887c4-a799-4301-8003-7fc8a101dd02";

    const paymentIntent = paymentIntents.data.find(
      (paymentIntent) => incident_id === paymentIntent.metadata.incident_id
    );

    if (!paymentIntent) {
      throw new Error(
        `Payment intent with incident id "${incident_id}" not found`
      );
    }

    return response.json({ client_secret: paymentIntent.client_secret });
  } catch ({ message }) {
    console.log(message);

    return response.json({
      error: message,
    });
  }
});

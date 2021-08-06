import express from "express";
import Stripe from "stripe";

const app = express();
const port = 3000;

const stripe = Stripe(SECRET_KEY, {
  apiVersion: "2020-08-27",
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

app.post("/create-payment-intent", async (request, response) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099, //lowest denomination of particular currency
      currency: "usd",
      payment_method_types: ["card"], //by default
    });

    const clientSecret = paymentIntent.client_secret;

    return response.json({
      clientSecret,
    });
  } catch ({ message }) {
    console.log(message);

    response.json({
      error: message,
    });
  }
});

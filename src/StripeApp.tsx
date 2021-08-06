import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";

import { CardField, CardFieldInput, useConfirmPayment, handleCardAction } from "@stripe/stripe-react-native";

const API_URL = "http://192.168.0.5:3000";

export function StripeApp(props) {
  const [email, setEmail] = useState('');
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details>({
  });

  const { confirmPayment, loading } = useConfirmPayment();

  async function fetchPaymentIntentClientSecret(email: string) {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: "POST",
      body: JSON.stringify({
        email
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { client_secret, error } = await response.json();

    return { client_secret, error };
  }

  async function handlePayPress() {
    console.log(cardDetails)
    //1.Gother the customer's billing information (e.g.,email)
    if (!cardDetails.complete || !email) {
      Alert.alert("Please enter complete card details and email");

      return;
    }

    const billingDetails = {
      email,
    };

    //2.Fetch the intent client secret from the backend

    try {
      const { client_secret, error } = await fetchPaymentIntentClientSecret(email);
      console.log(client_secret)
      if (error) {
        alert('Unable to process payment. Please try a valid customer email and credit card')
        console.log("Unable to process payment", error);
      } else {
        const { paymentIntent, error } = await confirmPayment(client_secret, {
          type: "Card",
          billingDetails
        });
        if (error) {
          alert(`Payment confirmation error ${error.message}`);
        } else if (paymentIntent) {
          alert("Payment Successful");
          console.log("Payment successful", paymentIntent);
        }
      }
    } catch (e) {
      console.log(e);
    }

    //3.Confirm the payment with the card details
  }

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder="E-mail"
        keyboardType="email-address"
        onChange={(value) => setEmail(value.nativeEvent.text)}
        style={styles.input}
      />
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={cardDetails => {
          setCardDetails(cardDetails);
        }}
      />

      <Button onPress={handlePayPress} title="Pay" disabled={loading} />
    </View>
  );
}

export default StripeApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    margin: 20,
  },
  input: {
    backgroundColor: "#efefefef",
    borderColor: "#000",
    borderRadius: 8,
    fontSize: 20,
    height: 50,
    padding: 10,
  },
  card: {
    backgroundColor: "#efefefef",
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
});

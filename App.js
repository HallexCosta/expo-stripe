import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { StripeApp } from "./src/StripeApp";

import { StripeProvider } from "@stripe/stripe-react-native";

export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_51JJSD2EPk8xX8xXn5Qv3PZG8Rhqthk8Oup0lvrc10OZzJjKZ5m1EfTr6Qz51H6YteriU7lV1EGUanLr0wpAvXDZo00RZLpsb7V">
      <StripeApp />
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

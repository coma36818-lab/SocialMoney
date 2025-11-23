'use client'
import { PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalButtonsComponentProps {
    amount: string;
    description: string;
}

export function PayPalButtonsComponent({ amount, description }: PayPalButtonsComponentProps) {

    const createOrder = (data: any, actions: any) => {
        return actions.order.create({
            purchase_units: [
                {
                    description: description,
                    amount: {
                        value: amount,
                    },
                    payee: {
                        email_address: "alibi81@libero.it",
                    }
                },
            ],
        });
    };

    const onApprove = (data: any, actions: any) => {
        alert("Payment successful! Please send your content to mydatingame@gmail.com");
        return actions.order.capture();
    };

    const onError = (err: any) => {
        console.error("PayPal Checkout onError", err);
        alert("An error occurred during payment. Please try again.");
    };

    return (
        <PayPalButtons
            style={{ layout: "vertical", color: 'blue', shape: 'rect', label: 'paypal' }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
        />
    );
}

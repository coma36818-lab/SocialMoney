
'use client'
import { PayPalButtons, PayPalButtonsComponentProps } from "@paypal/react-paypal-js";

interface CustomPayPalButtonsProps {
    amount: string;
    description: string;
}

export function PayPalButtonsComponent({ amount, description }: CustomPayPalButtonsProps) {

    const createOrder: PayPalButtonsComponentProps['createOrder'] = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    description: description,
                    amount: {
                        currency_code: "EUR",
                        value: amount,
                    },
                    payee: {
                        email_address: "alibi81@libero.it",
                    }
                },
            ],
            application_context: {
              shipping_preference: 'NO_SHIPPING'
            }
        });
    };

    const onApprove: PayPalButtonsComponentProps['onApprove'] = async (data, actions) => {
        if (!actions.order) {
            console.error("onApprove actions.order is undefined.");
            alert("There was an issue with the payment approval. Please try again.");
            return;
        }
        try {
            const details = await actions.order.capture();
            alert(`Payment of €${amount} successful! Thank you, ${details.payer.name?.given_name}. Please send your content to mydatingame@gmail.com`);
        } catch (err) {
            console.error("PayPal Checkout onApprove error", err);
            alert("An error occurred while capturing the payment. Please contact support.");
        }
    };

    const onError: PayPalButtonsComponentProps['onError'] = (err) => {
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


'use client';

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";

interface Plan {
    name: string;
    description: string;
    price: string;
}

interface PayPalButtonsComponentProps {
    plan: Plan;
}

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "YOUR_PAYPAL_CLIENT_ID";

export function PayPalButtonsComponent({ plan }: PayPalButtonsComponentProps) {
    const { toast } = useToast();

    if (PAYPAL_CLIENT_ID === "YOUR_PAYPAL_CLIENT_ID") {
        console.error("PayPal Client ID is not configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID in your environment variables.");
    }
    
    return (
        <PayPalScriptProvider options={{ "clientId": PAYPAL_CLIENT_ID, currency: "EUR" }}>
            <PayPalButtons
                style={{ layout: "vertical", color: 'blue', shape: 'rect', label: 'paypal' }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            description: `${plan.name} - ${plan.description}`,
                            amount: {
                                value: plan.price,
                                currency_code: "EUR"
                            }
                        }]
                    });
                }}
                onApprove={async (data, actions) => {
                    if (actions.order) {
                        const details = await actions.order.capture();
                        toast({
                            title: "Payment Successful!",
                            description: `Thank you for your purchase of the ${plan.name} plan.`,
                        });
                        console.log("Payment successful", details);
                    }
                }}
                onError={(err) => {
                    toast({
                        variant: "destructive",
                        title: "Payment Error",
                        description: "An error occurred during the payment process. Please try again.",
                    });
                    console.error("PayPal Error:", err);
                }}
            />
        </PayPalScriptProvider>
    );
}
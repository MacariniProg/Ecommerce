"use client";

import { userOrderExists } from "@/src/app/_actions/order";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { formatCurrency } from "@/src/lib/formatters";
import { Product } from "@prisma/client";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { FormEvent, useState } from "react";

type CheckoutFormProps = {
  product: Product;
  clientSecret: string;
};

const stripePromise = loadStripe(
  "pk_test_51PJyoR038LiMZKLVZhk9n7Zm6l1jor4mmLfEyNfQWVZSmapbTlfrO2jSvKMFlm0hGEc7PTQPiceU3qo05aa2653a00ORUh19vr"
);

export function CheckoutForm({ product, clientSecret }: CheckoutFormProps) {
  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </h3>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="line-clamp-3 text-muted-foreground">
            {product.description}
          </p>
        </div>
      </div>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form priceInCents={product.priceInCents} productId={product.id} />
      </Elements>
    </div>
  );
}

function Form({
  priceInCents,
  productId,
}: {
  priceInCents: number;
  productId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!stripe || !elements || !email) return;

    setIsLoading(true);

    const orderExists = await userOrderExists(email, productId);

    if (orderExists) {
      setErrorMessage("You have already purchased this product.");
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url:
            process.env.NEXT_PUBLIC_SERVER_URL + "/stripe/purchase-success",
        },
      })
      .then(({ error }) => {
        if (error.type == "card_error" || error.type == "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An error occurred. Please try again later.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <LinkAuthenticationElement
            onChange={(e) => setEmail(e.value.email)}
          />
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={!stripe || !elements || isLoading}
          >
            {isLoading
              ? "Purchase..."
              : `Purchase - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

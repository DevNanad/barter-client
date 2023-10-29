import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElementOptions } from "@stripe/stripe-js";
import { useState } from "react";
import { axiosPrivate } from "../api/axios";
import { useAuthStore } from "../hooks/state";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const CARD_OPTIONS: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: "gray",
        color: "black",
        fontWeight: 600,
        padding: "5px",
        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": { color: "#fce883" },
        "::placeholder": { color: "gray" },
      },
      invalid: {
        iconColor: "red",
        color: "red",
      },
    },
  };
  

export default function PaymentForm({plan}:any) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {user_id} = useAuthStore((state) => state)
  const stripe = useStripe();
  const elements = useElements();

  const queryClient = useQueryClient()

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setErrorMessage("Stripe is not properly initialized.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrorMessage("Card element is not available.");
      setLoading(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (!error) {
      try {
        setErrorMessage('')
        const { id } = paymentMethod;
        const response = await axiosPrivate.post("/user/pay", {
            user_id,
            plan,
            id,
        });

        console.log(response.data);
        
        if(response.data.message === 'success'){
            toast.success('Payment Success',{
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })

            await queryClient.invalidateQueries({
                queryKey: ['trader'],
                exact: true
            })
        }

      } catch (error:any) {
        setErrorMessage("An error occurred while processing the payment.");
      }
    }

    setLoading(false);
  };

  return (
    <>
        <form onSubmit={handleSubmit}>
          <fieldset className="FormGroup m-0 p-0 border-0 text-black bg-gray-200 transition-opacity shadow-md inset-shadow rounded-md">
            <div className="FormRow flex items-center">
              <CardElement options={CARD_OPTIONS} />
            </div>
          </fieldset>
          {loading ? (
            <button className="block text-base w-full my-5 px-6 py-3
            bg-violet-800 hover:bg-violet-700 shadow-md inset-shadow rounded-md text-white font-semibold cursor-pointer transition-all duration-100 ease-in-out" disabled>Loading...</button>
          ) : (
            <button className={`block text-base w-full my-5 px-6 py-3
            bg-violet-800 hover:bg-violet-700 shadow-md inset-shadow rounded-md text-white font-semibold cursor-pointer transition-all duration-100 ease-in-out ${plan === '' ? 'cursor-not-allowed' : ''} `} disabled={plan === ''}>Pay</button>
          )}
        </form>
      {errorMessage && <div className="error-message text-center text-red-400">{errorMessage}</div>}
    </>
  );
}

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import PaymentForm from "./PaymentForm"

const PUBLIC_KEY = "pk_test_51O5l1oKalfGUXZaql2NxUwbxeHEayOa3RGZk03czRqMC5m2HndiVM6TvjuNYcaYxYX612gzhJUIVQPbnkKSfjj7x00pUAtRVTK"

const stripeTestPromise = loadStripe(PUBLIC_KEY)

export default function StripeContainer({plan}:any) {
  return (
    <Elements stripe={stripeTestPromise}>
        <PaymentForm plan={plan} />
    </Elements>
  )
}

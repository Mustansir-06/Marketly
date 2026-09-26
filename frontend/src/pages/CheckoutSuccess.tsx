import { Link } from "react-router"

const CheckoutSuccess = () => {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-136px)] max-w-2xl flex-col items-center justify-center px-5 text-center sm:px-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#183c32]/10 text-3xl">
        ✓
      </div>

      <h1 className="mt-7 text-4xl font-semibold tracking-tight text-[#182420]">
        Order placed
      </h1>

      <p className="mt-4 max-w-md text-sm leading-6 text-[#6b6558]">
        Your order has been confirmed and the sellers have been notified.
        Thanks for shopping small.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/browse"
          className="rounded-md bg-[#183c32] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#102e27]"
        >
          Continue shopping
        </Link>
      </div>
    </section>
  )
}

export default CheckoutSuccess
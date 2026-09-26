import { Link } from "react-router"

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf9f6] px-5">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#537466]">
          404
        </p>

        <h1 className="mt-4 text-6xl font-semibold tracking-[-0.05em] text-[#183c32]">
          Page not found
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-stone-500">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-xl bg-[#183c32] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#102e27]"
        >
          Back home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
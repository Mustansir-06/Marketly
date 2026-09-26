import { Link } from "react-router"

const Footer = () => {
  return (
    <footer className="border-t border-stone-200 bg-[#f3f1eb]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">

          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#183c32] text-xs font-bold text-white">
                M
              </div>

              <span className="font-semibold text-[#1d2925]">
                Marketly
              </span>
            </div>

            <p className="max-w-sm text-sm leading-6 text-stone-500">
              A simple marketplace for discovering useful products from
              independent sellers.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-[#1d2925]">
              Explore
            </h3>

            <div className="space-y-3 text-sm text-stone-500">
              <Link
                to="/browse"
                className="block transition hover:text-[#183c32]"
              >
                Browse products
              </Link>

              <Link
                to="/about"
                className="block transition hover:text-[#183c32]"
              >
                About
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-[#1d2925]">
              Account
            </h3>

            <div className="space-y-3 text-sm text-stone-500">
              <Link
                to="/login"
                className="block transition hover:text-[#183c32]"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="block transition hover:text-[#183c32]"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-200 pt-6 text-xs text-stone-400">
          © 2026 Marketly. Built with React and TypeScript.
        </div>
      </div>
    </footer>
  )
}

export default Footer
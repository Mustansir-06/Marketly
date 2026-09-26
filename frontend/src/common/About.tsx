const About = () => {
  return (
    <div>
      <section className="mx-auto max-w-4xl px-5 pb-20 pt-20 text-center sm:px-8 lg:pt-28">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#537466]">
          About Marketly
        </p>

        <h1 className="mt-5 text-5xl font-semibold tracking-[-0.04em] text-[#183c32] sm:text-6xl">
          A marketplace built around people, not noise.
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-stone-500 sm:text-lg">
          Marketly gives independent sellers a simple place to showcase
          their products and gives shoppers a calmer way to discover
          something they actually want.
        </p>
      </section>

      <section className="bg-[#183c32] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-medium text-[#a9c1b5]">
                Why we built it
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight">
                Simple shopping. Straightforward selling.
              </h2>
            </div>

            <div className="space-y-6 text-sm leading-7 text-[#d1ddd7]">
              <p>
                Large marketplaces can make discovering smaller products
                surprisingly difficult. We wanted to create a simpler
                experience where the product stays at the centre.
              </p>

              <p>
                Sellers get the tools they need to list and manage their
                products, while shoppers can search, sort and browse without
                unnecessary friction.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="border-t border-stone-300 pt-5">
            <h3 className="text-lg font-semibold">For sellers</h3>
            <p className="mt-3 text-sm leading-6 text-stone-500">
              Create listings, manage stock and keep your catalogue organised.
            </p>
          </div>

          <div className="border-t border-stone-300 pt-5">
            <h3 className="text-lg font-semibold">For shoppers</h3>
            <p className="mt-3 text-sm leading-6 text-stone-500">
              Browse useful products with straightforward information about
              price, category and availability.
            </p>
          </div>

          <div className="border-t border-stone-300 pt-5">
            <h3 className="text-lg font-semibold">For everyone</h3>
            <p className="mt-3 text-sm leading-6 text-stone-500">
              A clean experience that stays focused on the products instead
              of getting in your way.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
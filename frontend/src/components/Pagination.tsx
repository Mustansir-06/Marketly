interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700 transition hover:border-[#183c32] hover:text-[#183c32] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`h-9 w-9 rounded-lg text-sm transition ${
                page === pageNumber
                  ? "bg-[#183c32] text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {pageNumber}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700 transition hover:border-[#183c32] hover:text-[#183c32] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
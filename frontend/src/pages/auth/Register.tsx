import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import axios from "axios"
import { api } from "../../services/axiosInstance"

interface RegisterForm {
  name: string
  email: string
  password: string
}

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: RegisterForm) => {
    setServerError(null)
    setIsSubmitting(true)
    try {
      await api.post("/api/auth/register", data)
      navigate("/login")
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setServerError(error.response.data.message || "Something went wrong. Please try again.")
      } else {
        setServerError("Something went wrong. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-136px)] max-w-7xl items-center justify-center px-5 py-16 sm:px-8">
      <div className="w-full max-w-md">
        <div className="mb-9">
          <p className="text-sm font-medium text-[#537466]">Join Marketly</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#183c32]">
            Create your account
          </h1>
          <p className="mt-3 text-sm text-stone-500">
            Start shopping or create your first product listing.
          </p>
        </div>

        {serverError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1d2925]">Full name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="Your name"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#183c32] focus:ring-2 focus:ring-[#183c32]/10"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#1d2925]">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#183c32] focus:ring-2 focus:ring-[#183c32]/10"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#1d2925]">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must contain at least 6 characters" },
              })}
              placeholder="At least 6 characters"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#183c32] focus:ring-2 focus:ring-[#183c32]/10"
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#183c32] py-3.5 text-sm font-medium text-white transition hover:bg-[#102e27] disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-[#183c32] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
import { createContext, useEffect, useState, type ReactNode } from "react"
import { api, setAccessToken } from "../services/axiosInstance"

interface User {
  name: string
  email: string
  role: "user" | "seller"
}

interface AuthContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  accessToken: string | null
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [accessToken, setAccessTokenState] = useState<string | null>(null)

  const handleSetAccessToken: React.Dispatch<React.SetStateAction<string | null>> = (token) => {
    setAccessTokenState((prev) => {
      const newToken = typeof token === "function" ? token(prev) : token
      setAccessToken(newToken) 
      return newToken
    })
  }

  const refreshUser = async () => {
    try {
      const res = await api.post("/api/auth/refresh-token")
      handleSetAccessToken(res.data.accesstoken)
      setUser(res.data.user)
    } catch (error) {
      console.log(error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoading, setIsLoading, accessToken, setAccessToken: handleSetAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  )
}
import axios from "axios"

export const api = axios.create({
    baseURL:  import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true
})

const plainAxios = axios.create({
    baseURL:  import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true
})

let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
    accessToken = token
}

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const res = await plainAxios.post("/api/auth/refresh-token")
                setAccessToken(res.data.accesstoken)

                originalRequest.headers.Authorization = `Bearer ${res.data.accesstoken}`
                return api(originalRequest)
            } catch (refreshError) {
                setAccessToken(null)
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)
import { CardDemo } from "../components/component/CardDemo"
import { Suspense, useState } from "react"
import { useAuth } from "../context/authContext"
import { storage } from "../utils/localStorage"
import { useNavigate } from "react-router-dom"

function Login() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const { login } = useAuth()

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        console.log("Submitting login form with:", {email, password, name})
        setError("")
        setIsLoading(true)
    

        try {
           
            // Validate inputs
            if (!email || !password) {
                setError("Please fill in all fields")
                setIsLoading(false)
                return
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                setError("Please enter a valid email address")
                setIsLoading(false)
                return
            }

            // Attempt login
            const success: boolean = await login(email, password)

            if (success) {
                storage.set('user', {name, email})
                navigate('/')
                // Login successful - redirect or show success
                console.log("Login successful!")
                
                // Navigation will be handled by AuthContext/App
            } else {
                setError("Invalid email or password")
            }
        } catch (err) {
            setError("An error occurred. Please try again.")
            console.error("Login error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
       <div className="relative">
            <CardDemo
                name={name}
                email={email}
                error={error}
                password={password}
                setName={setName}
                setEmail={setEmail}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
            />
           
        </div>
    )
}

export default Login
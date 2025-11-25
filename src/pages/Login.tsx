import { CardDemo } from "../components/component/CardDemo";
import { useState } from "react";
import { useAuth } from "../context/authContext";
import { storage } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [_, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const authContext = useAuth();
  const navigate = useNavigate();

interface FormEvent extends React.FormEvent<HTMLFormElement> {
    preventDefault: () => void;
}

const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
        if (!email || !password) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }

        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        if (!authContext) {
            setError("Auth context not available");
            setIsLoading(false);
            return;
        }

        const success: boolean = authContext.login(name, email, password);

        if (success) {
            storage.set("user", { name, email });
            navigate("/");
        } else {
            setError("Invalid email or password");
        }
    } catch (err) {
        setError("An error occurred. Please try again.");
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="border border-white rounded-2xl p-6 w-full max-w-md text-white shadow-lg bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

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
    </div>
  );
}

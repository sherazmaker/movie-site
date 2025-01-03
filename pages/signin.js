import { useState } from "react";
import { useRouter } from "next/router";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const router = useRouter();

  const validateForm = () => {
    if (!email) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationError(null);

    const validationMessage = validateForm();
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Something went wrong");
        return;
      }

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify({ email }));
        router.push("/movies");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#093545]">
      <div className="p-8 max-w-sm w-full">
        <h1 className="text-[20px] font-Montserrattext-center text-white mb-6">
          Sign in
        </h1>

        {validationError && (
          <p className="text-red-500 text-center mb-4">{validationError}</p>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#224957] font-Montserrat text-white rounded-xl outline-none"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#224957] font-Montserrat text-white rounded-xl outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 font-Montserrat text-white"
            >
            
            </button>
          </div>

          <div className="flex items-center justify-center text-white space-x-3">
            <input type="checkbox" id="remember" className="hidden peer" />
            <label
              htmlFor="remember"
              className="w-5 h-5 font-Montserrat bg-[#224957] rounded-md flex items-center justify-center cursor-pointer peer-checked:bg-[#1dd977]"
            >
              <svg
                className="w-4 h-4 text-white hidden peer-checked:block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </label>
            <label htmlFor="remember" className="cursor-pointer select-none font-Montserrat">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2BD17E] p-3 text-lg text-white rounded-xl font-Montserrat"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

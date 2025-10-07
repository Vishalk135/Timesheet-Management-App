"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email.");
      return;
    } else {
      setEmailError("");
    }

    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      rememberMe,
    });

    setLoading(false);

    if (res?.error) {
      alert("Invalid credentials. Try again.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center p-6 md:p-8 bg-white">
        <div className="w-full max-w-sm md:max-w-md">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900">
            Welcome back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm md:text-base font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-sm md:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && (
                <p className="text-red-500 text-xs md:text-sm mt-1">{emailError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm md:text-base font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="********"
                className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center text-sm md:text-base">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 md:h-5 md:w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 md:py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white transition duration-150 ease-in-out ${
                  loading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-blue-600 hidden md:flex items-center justify-center p-6 lg:p-12">
        <div className="text-white max-w-lg">
          <h1 className="text-3xl lg:text-4xl font-semibold mb-4">ticktock</h1>
          <p className="text-sm lg:text-base font-light leading-relaxed">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            ticktock, you can effortlessly track and monitor employee
            attendance and productivity from anywhere, anytime, using any
            internet-connected device.
          </p>
        </div>
      </div>
    </div>
  );
}

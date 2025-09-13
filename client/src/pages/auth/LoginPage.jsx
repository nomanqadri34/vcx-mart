import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { login, googleAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear the message from navigation state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Get the intended destination from location state or query params
  const from =
    location.state?.from?.pathname ||
    location.search?.split("redirect=")[1] ||
    "/user/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");

      const result = await login(data.email, data.password, "web");

      if (result && result.success) {
        // Check if email is verified
        if (result.user && !result.user.isEmailVerified) {
          setError("Please verify your email address before logging in.");
          navigate("/verify-email", {
            state: {
              message: "Please verify your email address to continue.",
              email: data.email,
            },
          });
          return;
        }
        
        // Redirect to intended destination or dashboard
        navigate(from, { replace: true });
      } else {
        setError(result?.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    console.log("🔍 Google login initiated:", credentialResponse);
    try {
      setIsLoading(true);
      setError("");

      if (credentialResponse.credential) {
        console.log("✅ Credential received, decoding...");
        // Decode the JWT token to get user info
        const decoded = jwtDecode(credentialResponse.credential);
        console.log("✅ Token decoded:", {
          email: decoded.email,
          name: decoded.name,
        });

        console.log("🚀 Calling backend googleAuth...");
        // Call the backend Google OAuth endpoint
        const result = await googleAuth(credentialResponse.credential, "web");

        console.log("📥 Backend response:", result);

        if (result && result.success) {
          console.log("✅ Login successful, redirecting...");
          // Redirect to intended destination or dashboard
          navigate(from, { replace: true });
        } else {
          console.log("❌ Login failed:", result?.error);
          setError(result?.error || "Google login failed. Please try again.");
        }
      } else {
        console.log("❌ No credential in response");
        setError("No credential received from Google");
      }
    } catch (err) {
      console.error("💥 Google login error:", err);
      setError(`Google login failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-saffron-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-saffron-500 to-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">C</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-saffron-600 hover:text-saffron-500 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-saffron-600 focus:ring-saffron-500 border-gray-300 rounded"
                {...register("rememberMe")}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-saffron-600 hover:text-saffron-500 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                !isValid || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-saffron-600 to-green-600 hover:from-saffron-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 transition-all duration-200"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-saffron-50 to-green-50 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google OAuth Login */}
            {import.meta.env.VITE_ENABLE_GOOGLE_AUTH === "true" &&
              import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                <div className="mt-6">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={(error) => {
                      console.error("Google OAuth Error:", error);
                      setError(
                        "Google login failed. Please check your internet connection and try again."
                      );
                    }}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    text="continue_with"
                    shape="rectangular"
                    auto_select={false}
                  />
                </div>
              )}


          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-saffron-600 hover:text-saffron-500 transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

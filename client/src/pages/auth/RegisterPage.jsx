import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";


const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register: registerUser, googleAuth, resendVerification } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
      marketingConsent: false,
    },
  });

  const password = watch("password");

  const handleGoogleLogin = async (credentialResponse) => {
    console.log("🔍 Google registration initiated:", credentialResponse);
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
        // Call googleAuth for Google registration/login
        const result = await googleAuth(credentialResponse.credential, "web");

        console.log("📥 Backend response:", result);

        if (result && result.success) {
          console.log("✅ Registration successful, redirecting...");
          // Redirect to email verification or dashboard based on the response
          if (result.data?.requiresEmailVerification) {
            navigate('/verify-email', {
              state: {
                email: decoded.email,
                message: 'Please verify your email to continue'
              }
            });
          } else {
            navigate('/user/dashboard');
          }
        } else {
          console.log("❌ Registration failed:", result?.error);
          setError(result?.error?.message || result?.error || 'Registration failed');
        }
      } else {
        console.log("❌ No credential in response");
        setError("No credential received from Google");
      }
    } catch (err) {
      console.error('💥 Google registration error:', err);
      setError(err?.response?.data?.error?.message || err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");

      console.log('Submitting registration data:', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        termsAccepted: data.termsAccepted,
        marketingConsent: data.marketingConsent
      });

      const result = await registerUser({
        name: `${data.firstName.trim()} ${data.lastName.trim()}`,
        email: data.email.toLowerCase().trim(),
        phone: data.phone.trim(),
        password: data.password,
      });

      if (result && result.success) {
        navigate("/verify-email", {
          state: {
            message: "Account created successfully! Please check your email for the verification code.",
            email: data.email,
          },
          replace: true,
        });
      } else {
        console.error('Registration failed:', result);
        const errorMsg = result?.error || result?.message || "Registration failed. Please try again.";
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Registration error details:", {
        error: err,
        response: err.response,
        data: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });

      let errorMsg = "Registration failed. Please try again.";

      if (err.response?.data) {
        if (err.response.data.error?.message) {
          errorMsg = err.response.data.error.message;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else if (err.response.data.errors) {
          // Handle validation errors array
          const validationErrors = err.response.data.errors;
          if (Array.isArray(validationErrors)) {
            errorMsg = validationErrors.map(e => e.message || e.msg || e).join(', ');
          } else {
            errorMsg = JSON.stringify(validationErrors);
          }
        }
      }

      setError(errorMsg);
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-saffron-600 hover:text-saffron-500 transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    className={`appearance-none relative block w-full px-3 py-2 border ${errors.firstName ? "border-red-300" : "border-gray-300"
                      } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 focus:z-10 sm:text-sm`}
                    placeholder="First name"
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "First name cannot exceed 50 characters",
                      },
                    })}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    className={`appearance-none relative block w-full px-3 py-2 border ${errors.lastName ? "border-red-300" : "border-gray-300"
                      } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 focus:z-10 sm:text-sm`}
                    placeholder="Last name"
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Last name cannot exceed 50 characters",
                      },
                    })}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Email Field */}
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
                  className={`appearance-none relative block w-full px-3 py-2 border ${errors.email ? "border-red-300" : "border-gray-300"
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

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 border ${errors.phone ? "border-red-300" : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter 10-digit phone number"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Please enter a valid 10-digit phone number",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password Fields */}
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
                  autoComplete="new-password"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${errors.password ? "border-red-300" : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 focus:z-10 sm:text-sm`}
                  placeholder="Create a strong password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${errors.confirmPassword
                    ? "border-red-300"
                    : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 focus:z-10 sm:text-sm`}
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="termsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-saffron-600 focus:ring-saffron-500 border-gray-300 rounded"
                  {...register("termsAccepted", {
                    required: "You must accept the terms and conditions",
                  })}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="termsAccepted" className="text-gray-700">
                  I agree to the{" "}
                  <Link
                    to="/terms-of-service"
                    className="text-saffron-600 hover:text-saffron-500 transition-colors"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-saffron-600 hover:text-saffron-500 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </label>
                {errors.termsAccepted && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.termsAccepted.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="marketingConsent"
                  name="marketingConsent"
                  type="checkbox"
                  className="h-4 w-4 text-saffron-600 focus:ring-saffron-500 border-gray-300 rounded"
                  {...register("marketingConsent")}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="marketingConsent" className="text-gray-700">
                  I would like to receive marketing emails about new products,
                  special offers, and updates
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${!isValid || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-saffron-600 to-green-600 hover:from-saffron-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 transition-all duration-200"
                }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Create account"
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



            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-saffron-50 to-green-50 text-gray-500">
                    Or register with
                  </span>
                </div>
              </div>

              {/* Google OAuth Register */}
              {import.meta.env.VITE_ENABLE_GOOGLE_AUTH === "true" &&
                import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                  <div className="mt-6">
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={(error) => {
                        console.error("Google OAuth Error:", error);
                        setError(
                          "Google registration failed. Please try again or use email registration."
                        );
                      }}
                      useOneTap={false}
                      theme="outline"
                      size="large"
                      text="signup_with"
                      shape="rectangular"
                      auto_select={false}
                    />
                  </div>
                )}
            </div>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-saffron-600 hover:text-saffron-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

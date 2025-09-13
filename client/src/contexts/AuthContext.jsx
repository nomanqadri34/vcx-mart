import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, sellerAPI } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          // Verify token is still valid by making a request
          const response = await authAPI.getProfile();
          if (response.data.success) {
            setUser(response.data.data.user);
            setIsAuthenticated(true);
          } else {
            // Token invalid, clear storage
            clearAuthData();
          }
        }
      } catch (error) {
        // Token invalid or expired, clear storage
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (email, password, deviceInfo = "web") => {
    try {
      setLoading(true);

      const response = await authAPI.login({
        email,
        password,
        deviceInfo,
      });

      if (response.data.success) {
        const {
          user: userData,
          token,
          accessToken,
          refreshToken,
        } = response.data.data;

        // Use token if accessToken is not provided (for backward compatibility)
        const authToken = accessToken || token;
        
        // Store tokens and user data
        localStorage.setItem("accessToken", authToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);

        toast.success("Login successful!");
        return { success: true, user: userData };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        "Login failed. Please try again.";
      const errorCode = error.response?.data?.error?.code;

      // Handle email verification error
      if (errorCode === "EMAIL_NOT_VERIFIED") {
        toast.error("Please verify your email address before logging in.");
        // Redirect to email verification page
        window.location.href = `/verify-email?email=${encodeURIComponent(
          email
        )}`;
        return { success: false, error: errorMessage, code: errorCode };
      }

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);

      const response = await authAPI.register(userData);

      if (response.data.success) {
        toast.success(
          "Registration successful! Please check your email to verify your account."
        );
        return {
          success: true,
          message:
            "Registration successful! Please check your email to verify your account.",
        };
      }
    } catch (error) {
      console.error('Registration error in AuthContext:', JSON.stringify(error.response?.data, null, 2));
      console.error('Full error object:', error.response);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.response?.data) {
        const data = error.response.data;
        if (data.error?.message) {
          errorMessage = data.error.message;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.errors) {
          if (Array.isArray(data.errors)) {
            errorMessage = data.errors.map(e => e.message || e.msg || e).join(', ');
          } else {
            errorMessage = Object.values(data.errors).flat().join(', ');
          }
        } else if (data.details) {
          errorMessage = data.details;
        }
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      

      clearAuthData();
      toast.success("Logged out successfully");
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);

      const response = await authAPI.forgotPassword(email);

      if (response.data.success) {
        toast.success(response.data.message);
        return { success: true };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        "Failed to send password reset email.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);

      const response = await authAPI.resetPassword(token, newPassword);

      if (response.data.success) {
        toast.success("Password reset successfully!");
        return { success: true };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Password reset failed.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);

      const response = await authAPI.changePassword(
        currentPassword,
        newPassword
      );

      if (response.data.success) {
        toast.success("Password changed successfully!");
        return { success: true };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to change password.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      setLoading(true);

      const response = await authAPI.verifyEmail(email, otp);

      if (response.data.success) {
        // Update user's email verification status
        if (user) {
          setUser({ ...user, isEmailVerified: true });
          localStorage.setItem(
            "user",
            JSON.stringify({ ...user, isEmailVerified: true })
          );
        }

        toast.success("Email verified successfully!");
        return { success: true };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Email verification failed.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email) => {
    try {
      setLoading(true);

      const response = await authAPI.resendVerification(email);

      if (response.data.success) {
        toast.success("Verification email sent successfully!");
        return { success: true };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        "Failed to resend verification email.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (phone) => {
    try {
      setLoading(true);

      const response = await authAPI.sendOTP(phone);

      if (response.data.success) {
        toast.success("OTP sent successfully!");
        return { success: true };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to send OTP.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp) => {
    try {
      setLoading(true);

      const response = await authAPI.verifyOTP(otp);

      if (response.data.success) {
        // Update user's phone verification status
        if (user) {
          setUser({ ...user, isPhoneVerified: true });
          localStorage.setItem(
            "user",
            JSON.stringify({ ...user, isPhoneVerified: true })
          );
        }

        toast.success("Phone verified successfully!");
        return { success: true };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "OTP verification failed.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = async (idToken, deviceInfo = "web") => {
    try {
      setLoading(true);

      const response = await authAPI.googleAuth(idToken, deviceInfo);

      if (response.data.success) {
        const {
          user: userData,
          token,
          accessToken,
          refreshToken,
        } = response.data.data;

        // Use token if accessToken is not provided (for backward compatibility)
        const authToken = accessToken || token;
        
        // Store tokens and user data
        localStorage.setItem("accessToken", authToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);

        toast.success("Google authentication successful!");
        return { success: true, user: userData };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Google authentication failed.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const linkGoogleAccount = async (idToken) => {
    try {
      setLoading(true);

      const response = await authAPI.linkGoogleAccount(idToken);

      if (response.data.success) {
        const updatedUser = response.data.data.user;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        toast.success("Google account linked successfully!");
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        "Failed to link Google account.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const unlinkGoogleAccount = async () => {
    try {
      setLoading(true);

      const response = await authAPI.unlinkGoogleAccount();

      if (response.data.success) {
        const updatedUser = {
          ...user,
          googleId: undefined,
          googleEmail: undefined,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        toast.success("Google account unlinked successfully!");
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        "Failed to unlink Google account.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const applyAsSeller = async (sellerData) => {
    try {
      setLoading(true);

      const response = await sellerAPI.applyAsSeller(sellerData);

      if (response.data.success) {
        toast.success("Seller application submitted successfully!");
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        "Failed to submit seller application.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);

      const response = await authAPI.updateProfile(profileData);

      if (response.data.success) {
        const updatedUser = response.data.data.user;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        toast.success("Profile updated successfully!");
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to update profile.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.data.success) {
        const updatedUser = response.data.data.user;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
    resendVerification,
    sendOTP,
    verifyOTP,
    googleAuth,
    linkGoogleAccount,
    unlinkGoogleAccount,
    applyAsSeller,
    updateProfile,
    refreshUserData,
    clearAuthData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

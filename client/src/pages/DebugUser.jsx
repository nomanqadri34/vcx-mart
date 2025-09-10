import React from "react";
import { useAuth } from "../contexts/AuthContext";

const DebugUser = () => {
  const { user, isAuthenticated, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">User Debug Information</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p>
              <strong>Is Authenticated:</strong>{" "}
              {isAuthenticated ? "Yes" : "No"}
            </p>
            <p>
              <strong>Loading:</strong> {loading ? "Yes" : "No"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">User Object</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">User Role</h2>
          <div className="space-y-2">
            <p>
              <strong>Role:</strong> {user?.role || "Not set"}
            </p>
            <p>
              <strong>Can access user dashboard:</strong>{" "}
              {["user", "seller", "admin"].includes(user?.role) ? "Yes" : "No"}
            </p>
            <p>
              <strong>Can access seller dashboard:</strong>{" "}
              {["seller", "admin"].includes(user?.role) ? "Yes" : "No"}
            </p>
            <p>
              <strong>Can access admin dashboard:</strong>{" "}
              {["admin"].includes(user?.role) ? "Yes" : "No"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Local Storage</h2>
          <div className="space-y-2">
            <p>
              <strong>Access Token:</strong>{" "}
              {localStorage.getItem("accessToken") ? "Present" : "Missing"}
            </p>
            <p>
              <strong>Refresh Token:</strong>{" "}
              {localStorage.getItem("refreshToken") ? "Present" : "Missing"}
            </p>
            <p>
              <strong>User Data:</strong>{" "}
              {localStorage.getItem("user") ? "Present" : "Missing"}
            </p>
          </div>
          {localStorage.getItem("user") && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Stored User Data:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {localStorage.getItem("user")}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugUser;

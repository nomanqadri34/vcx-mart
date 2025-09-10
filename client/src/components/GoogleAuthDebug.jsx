import React from "react";

const GoogleAuthDebug = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isGoogleAuthEnabled = import.meta.env.VITE_ENABLE_GOOGLE_AUTH;

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Google Auth Debug Info</h3>
      <div className="space-y-2 text-sm">
        <p>
          <strong>Google Client ID:</strong>{" "}
          {googleClientId
            ? `${googleClientId.substring(0, 20)}...`
            : "Not configured"}
        </p>
        <p>
          <strong>Google Auth Enabled:</strong> {isGoogleAuthEnabled}
        </p>
        <p>
          <strong>Environment:</strong> {import.meta.env.MODE}
        </p>
      </div>
    </div>
  );
};

export default GoogleAuthDebug;

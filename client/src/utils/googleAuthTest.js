// Google OAuth Test Utility
export const testGoogleAuth = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const isEnabled = import.meta.env.VITE_ENABLE_GOOGLE_AUTH;

    console.log('=== Google OAuth Configuration Test ===');
    console.log('Client ID:', clientId ? `${clientId.substring(0, 20)}...` : 'NOT CONFIGURED');
    console.log('Enabled:', isEnabled);
    console.log('Environment:', import.meta.env.MODE);

    // Test if Google APIs are accessible (disabled due to CORS)
    const testGoogleAPI = () => {
        console.log('ℹ️ Google API test disabled (CORS restrictions)');
        console.log('✅ Google OAuth should work if origins are configured correctly');
        return true;
    };

    // Test client ID format
    const testClientIdFormat = () => {
        if (!clientId) {
            console.log('❌ Client ID is missing');
            return false;
        }

        if (!clientId.includes('.apps.googleusercontent.com')) {
            console.log('❌ Client ID format is invalid');
            return false;
        }

        console.log('✅ Client ID format is valid');
        return true;
    };

    // Run tests
    testClientIdFormat();
    testGoogleAPI();

    // Recommendations
    console.log('\n=== Troubleshooting Steps ===');
    console.log('1. Verify Google Console OAuth configuration');
    console.log('2. Add http://localhost:3000 and http://localhost:5173 to authorized origins');
    console.log('3. Enable Google+ API and Google Identity API');
    console.log('4. Clear browser cache and restart dev server');
    console.log('5. Check browser console for specific error messages');
};

// Auto-run in development
if (import.meta.env.MODE === 'development') {
    // Run test after a short delay to ensure environment is loaded
    setTimeout(testGoogleAuth, 1000);
}
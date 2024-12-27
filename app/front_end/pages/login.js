import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";

const LoginPage = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const clientID = "77417357586-4foh6oip5s2d43mse15ni2e03agjbq21.apps.googleusercontent.com";

  const onSuccess = async (credentialResponse) => {
    if (credentialResponse && credentialResponse.credential) {
      try {
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credentialResponse.credential}`);
        const userData = await response.json();
        
        if (userData.error) {
          console.log("Token verification failed:", userData.error);
          return;
        }

        console.log("Verified user data:", userData);
        setUser(userData);
        localStorage.setItem("token", credentialResponse.credential);
        localStorage.setItem("user", JSON.stringify(userData));
        router.push("http://localhost:3000/");
      } catch (error) {
        console.error("Token verification error:", error);
      }
    }
  };

  const onError = () => {
    console.log("Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientID}>
      <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
      <p className="text-gray-600">Sign in to access all content!</p>
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          useOneTap
          theme="filled_black"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;

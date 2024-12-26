import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";

const LoginPage = () => {
  const [user, setUser] = useState(null);
  const router = useRouter(); // Usamos useRouter de Next.js para navegar

  const clientID = "77417357586-4foh6oip5s2d43mse15ni2e03agjbq21.apps.googleusercontent.com";

  const onSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    if (credentialResponse && credentialResponse.tokenId) {
      const decoded = jwt_decode(credentialResponse.tokenId);
      console.log(decoded);
      setUser(decoded);
      // Guarda el usuario en el localStorage
      localStorage.setItem("user", JSON.stringify(decoded));
      // Redirige a la página de inicio
      router.push("/home");
    } else {
      console.log("No tokenId found in response");
    }
  };

  const onError = () => {
    console.log("Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientID}>
      <div className="center">
        <h1>Login</h1>
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;

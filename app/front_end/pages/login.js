import { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
//import { json } from "stream/consumers";
//import { runTurboTracing } from "next/dist/build/swc/generated-native";

const LoginPage = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [userDB, setUserDB] = useState({
    name: "",
    gmail: "",
    googleID: 0,
    rating: 0.0,
    nComentarios: 0,
    level: "redactor",
  });
  const clientID ="77417357586-4foh6oip5s2d43mse15ni2e03agjbq21.apps.googleusercontent.com";
  //"72708585850-75939q01vfna5b2tgqdiqr53qc13iupk.apps.googleusercontent.com";
  // "77417357586-4foh6oip5s2d43mse15ni2e03agjbq21.apps.googleusercontent.com";

  const onSuccess = async (credentialResponse) => {
    if (credentialResponse && credentialResponse.credential) {
      try {
        let response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credentialResponse.credential}`);
        const userData = await response.json();
        
        if (userData.error) {
          console.log("Token verification failed:", userData.error);
          return;
        }
        console.log("Verified user data:", userData);
        setUser(userData);

        localStorage.setItem("token", credentialResponse.credential);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("email", userData.email);
        
        
        window.dispatchEvent(new Event('tokenUpdated'));
       
      } catch (error) {
        console.error("Token verification error:", error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      setUserDB((prev) => ({
        ...prev,
        name: user.name,
        gmail: user.email,
        googleID: user.sub,
      }));
    }
  }, [user]);
  
  useEffect(() => {
    if (userDB.name && userDB.gmail && userDB.googleID) {
      const updateUserDB = async () => {
        try {
          console.log(userDB);
          let response = await fetch(`${process.env.NEXT_PUBLIC_USERS_API_URL}/api/v1/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userDB),
          });
          const responsePost = await response.json();
          console.log("POST: ", responsePost);
          response = await fetch(`${process.env.NEXT_PUBLIC_USERS_API_URL}/api/v1/users/${userDB.googleID}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const userDBData = await response.json() ;
          setUserDB(userDBData);
          console.log("GET:", userDBData);
          localStorage.setItem("userDB", JSON.stringify(userDBData));
        } catch (error) {
          console.error("Error al actualizar userDB:", error);
        }
      };
      updateUserDB();
      router.push("/");
    }
  }, [userDB]);

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

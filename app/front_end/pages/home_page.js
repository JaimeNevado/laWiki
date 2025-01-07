import LinkButton from "../components/buttons/button_with_link";
import { useEffect, useState } from "react";
import WikiList from "../components/wikis";
import { useRouter } from "next/router";
import { refreshNotifications } from "../components/notifications/notifications_bell";

export default function HomePage() {
  const [wikis, setWikis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  // const [language, setLanguage] = useState("en"); // Idioma por defecto
  const [translatedContent, setTranslatedContent] = useState({}); // Traducción de contenido

  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem("user"));
    setUser(userFromLocalStorage || null); // Permite que el usuario sea null
    const userEmail = localStorage.getItem("email");
    if (userEmail) {
      refreshNotifications(userEmail);
    }
  }, []);

  useEffect(() => {
    // Personalización del fondo
    const myDiv = document.getElementById("main_wrapper");
    if (myDiv) {
      myDiv.style.backgroundImage = "none";
      myDiv.style.backgroundColor = "#fcfcfc";
    }

    // Fetch de las wikis desde el backend
    fetch(`${process.env.NEXT_PUBLIC_WIKI_API_URL}/api/v1/wikis`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch wikis");
        }
        return response.json();
      })
      .then((data) => {
        setWikis(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // useEffect(() => {
  //   const fetchTranslations = async () => {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_WIKI_API_URL}/api/v1/translate?target_language=${language}`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         content: {
  //           "welcomeMessage": "Welcome to Wiki!",
  //           "createWiki": "Create Wiki",
  //           "viewWiki": "View Wiki",
  //           "notLoggedIn": "You are not logged in."
  //         },  // Aquí puedes cambiar el texto que desees traducir
  //       }),
  //     });

  //     if (!response.ok) {
  //       console.error("Error al traducir el texto");
  //       return;
  //     }

  //     const result = await response.json();
  //     console.log("Traducción recibida:", result.content); // Verifica que el contenido sea correcto

  //     setTranslatedContent(result.content);
  //   };

  //   fetchTranslations();
  // }, [language]);

  // const handleLanguageChange = (e) => {
  //   setLanguage(e.target.value);
  // };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <>
      <div className="container text-center mt-4">
        <h1>{translatedContent?.welcomeMessage || "Welcome to Wiki!"}</h1>
      </div>
      <div className="profile">
        {user ? (
          <>
            <img src={user.picture} alt={user.name} />
            <h3>{user.name}</h3>
          </>
        ) : (
          <p className="text-muted">{translatedContent?.notLoggedIn || "You are not logged in."}</p>
        )}
      </div>

      <div className="container mt-5">
        <div className="text-end me-2 mb-4">
          {user ? (
            <LinkButton
              btn_type={"btn btn-secondary"}
              button_text={translatedContent?.createWiki || "Create Wiki"}
              state="enabled"
              link="/wiki/wiki_form"
            />
          ) : ""}
        </div>

        <div className="row">
          {wikis.map((wiki) => (
            <div key={wiki._id} className="col-md-4">
              <div className="card mb-3">
                <img
                  src={wiki.bg_image || "/placeholder.jpg"}
                  className="card-img-top"
                  alt={wiki.name || "Wiki Image"}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{wiki.name}</h5>
                  <LinkButton
                    btn_type={"btn btn-dark"}
                    button_text={translatedContent?.viewWiki || "View Wiki"}
                    state="enabled"
                    link={`/wiki/${wiki._id}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WikiList wikis={wikis} />
    </>
  );
}
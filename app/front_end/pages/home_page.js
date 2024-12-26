// import LikeButton from "../components/buttons/like_button";
import LinkButton from '../components/buttons/button_with_link';
import { useEffect, useState } from "react";
import WikiList from "../components/wikis";
import { useRouter } from "next/router";
import { refreshNotifications } from '../components/notifications/notifications_bell';

export default function HomePage() {
  const [wikis, setWikis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem("user"));
    if (!userFromLocalStorage) {
      router.push("/login"); // Redirige al login si no hay usuario
    } else {
      setUser(userFromLocalStorage);
    }
  }, [router]);

  useEffect(() => {
    refreshNotifications();
    // Personalización del fondo
    const myDiv = document.getElementById('main_wrapper');
    if (myDiv) {
      myDiv.style.backgroundImage = "none";
      myDiv.style.backgroundColor = "#fcfcfc";
    }

    // Fetch de las wikis desde el backend
    fetch("http://127.0.0.1:13000/api/v1/wikis")
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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <>
      {/* Bienvenida */}
      <div className="container text-center mt-4">
        <h1>Welcome to Wiki!</h1>
      </div>
      <div className="profile">
        {user && (
          <>
            <img src={user.picture} alt={user.name} />
            <h3>{user.name}</h3>
          </>
        )}
      </div>

      <div className="container mt-5">
        <div className="text-end me-2 mb-4">
          <LinkButton
            btn_type={"btn-primary"}
            button_text="Create Wiki"
            state="enabled"
            link="/wiki/wiki_form"
          />
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
                    btn_type={"btn-primary"}
                    button_text="View Wiki"
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

import LinkButton from '../components/buttons/button_with_link';
import { useEffect, useState } from "react";
import WikiList from "../components/wikis";
import router from 'next/router';
export default function HomePage() {
  const [wikis, setWikis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [author, setAuthor] = useState(''); // Estado para el nombre del autor
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem("user"));
    setUser(userFromLocalStorage || null); // Permite que el usuario sea null
    if (userFromLocalStorage) {
      refreshNotifications();
    }
    if(!user){
      router.push("/login");
    }
  }, []);
  const fetchWikis = (author = '') => {
    setLoading(true); // Inicia la carga
    let url = `${process.env.NEXT_PUBLIC_WIKI_API_URL}/api/v1/wikis`;
    if (author) {
      url += `?author=${author}`;
    }

    fetch(url)
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
  };

  useEffect(() => {
    // Personalización del fondo
    const myDiv = document.getElementById('main_wrapper');
    if (myDiv) {
      myDiv.style.backgroundImage = "none";
      myDiv.style.backgroundColor = "#fcfcfc";
    }

    // Fetch inicial sin autor
    fetchWikis();
  }, []); // Se ejecuta solo al montar el componente

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value); // Actualiza el autor cuando el usuario escribe
  };

  const handleSearchClick = () => {
    fetchWikis(author); // Llama al fetch con el autor actual
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <>
      {/* Bienvenida */}
      <div className="container text-center mt-4">
        <h1>Welcome to Wiki!</h1>
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
        
        {/* Campo de entrada para autor */}
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Enter author name"
            value={author}
            onChange={handleAuthorChange} // Actualiza el estado cuando cambia el texto
          />
        </div>
        
        {/* Botón de búsqueda */}
        <div className="text-end mb-4">
          <button className="btn btn-secondary" onClick={handleSearchClick}>
            Search by Author
          </button>
        </div>
      </div>
      
      <WikiList wikis={wikis} />
    </>
  );
}

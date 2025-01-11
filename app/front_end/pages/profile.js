import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LinkButton from '../components/buttons/button_with_link';
import styles from "../css/ArticlePage.module.css";
import WikiList from "../components/wikis";

// Importa ClientOnly usando dynamic con ssr: false
const ClientOnly = dynamic(() => import('../components/ClientOnly'), { ssr: false });

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
  </div>
);

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [wikis, setWikis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!storedUser || !token) {
        console.error('User or token not found');
        window.location.href = '/login';
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);

        // Fetch wikis created by the user
        const response = await fetch(`${process.env.NEXT_PUBLIC_WIKI_API_URL}/api/v1/wikis`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch wikis: ${errorText}`);
        }

        const data = await response.json();

        // Filtrar las wikis cuyo autor coincida con el nombre del usuario
        const userWikis = data.filter((wiki) => wiki.author === parsedUser.name);
        setWikis(userWikis);
      } catch (error) {
        console.error('Error fetching wikis:', error.message || error);
        alert('Error fetching user data or wikis. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
  
      if (!storedUser || !token) {
        console.error("User or token not found");
        window.location.href = "/login"; // Redirige al login si no hay usuario o token
        return;
      }
  
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
  
        // Codificar el destination_id (en este caso, el correo electrónico del usuario)
        const encodedDestinationId = encodeURIComponent(parsedUser.email); // Codificación correcta del email
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_COMMENTS_API_URL}/api/v1/comments?destination_id=${encodedDestinationId}`, {
          headers: { Authorization: `Bearer ${token}` }, // Añadir el token de autorización en el header
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch comments: ${errorText}`);
        }
  
        const data = await response.json();
        console.log("Fetched comments data:", data); // Verificar la respuesta de los comentarios
  
        setComments(data); // Guardar los comentarios obtenidos en el estado
      } catch (error) {
        console.error("Error fetching comments:", error.message || error);
        setError(error.message);
      } finally {
        setIsLoading(false); // Dejar de mostrar el indicador de carga
      }
    };
  
    fetchComments();
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <ClientOnly>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your information and content</p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 ring-4 ring-white shadow-lg">
                {userData?.picture ? (
                  <img
                    src={userData.picture}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {userData?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">{userData?.name}</h2>
              <p className="text-gray-600 text-sm">{userData?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className={`${styles.button} ${styles.deleteButton}`}
              style={{
                backgroundColor: "#3498db",
                color: "#fff",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "5px",
              }}
            >
              <span>Logout</span>
            </button>
          </div>

          <div className="col-span-2">
            <h2 className="text-center mt-4 text-xl font-semibold text-gray-900">Your Wikis</h2>
            <div className="text-end me-2 mb-4">
              <LinkButton
                btn_type={"btn-primary"}
                button_text="Create Wiki"
                state="enabled"
                link="/wiki/wiki_form"
              />
            </div>

            {wikis.length > 0 ? (
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
                          button_text="View Wiki"
                          state="enabled"
                          link={`/wiki/${wiki._id}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">You haven't created any wikis yet! Get started now!</p>
            )}
            
          </div>
          <div className={styles.commentsContainer}>
            {comments.length > 0 ? (
              <>
                <h2 className={styles.title}>Your Comments</h2>
                {comments.map((comment) => (
                  <div key={comment._id} className={styles.commentCard}>
                    <h3 className={styles.commentTitle}>{comment.title}</h3>
                    
                    <p className={styles.commentDate}>
                      <strong>Date:</strong>{" "}
                      {comment.date ? new Date(comment.date).toLocaleString() : "No date"}
                    </p>

                    <p className={styles.commentAuthor}>
                      <strong>Author:</strong> {comment.author_id || "Anonymous"}
                    </p>

                    <p className={styles.commentRating}>
                      <strong>Rating:</strong> {comment.rating || "No rating"}
                    </p>

                    <p className={styles.commentBody}>
                      {comment.content || "No content for this comment."}
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <p className={styles.noComments}>You didn't publish any comment yet.</p>
            )}
          </div>


          
        </div>
      </div>
    </ClientOnly>
  );
};

export default UserProfile;

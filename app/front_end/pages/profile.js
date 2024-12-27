import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LinkButton from '../components/buttons/button_with_link';
import styles from "../css/ArticlePage.module.css";

// Importa ClientOnly usando dynamic con ssr: false
const ClientOnly = dynamic(() => import('../components/ClientOnly'), { ssr: false });

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
  </div>
);

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [userWikis, setUserWikis] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const init = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!storedUser || !token) {
        window.location.href = '/login';
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        
      } catch (error) {
        console.error('Error parsing user data:', error);
        window.location.href = '/login';
      }
    };
    init();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!isClient) {
    return null;
  }

return (
    <ClientOnly>
        {!userData ? <LoadingSpinner /> : (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-600">Manage your information and content</p>
                </div>

                <div className="grid gap-12 md:grid-cols-3">
                    <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 ring-4 ring-white shadow-lg">
                                {userData.picture ? (
                                    <img 
                                        src={userData.picture} 
                                        alt={userData.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                                        {userData.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
                            <h2 className="mt-4 text-xl font-semibold text-gray-900">{userData.name}</h2>
                            <p className="text-gray-600 text-sm">{userData.email}</p>
                        </div>

                        {userData.locale && (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Idioma Preferido</p>
                                <p className="font-medium text-gray-900 capitalize">{userData.locale}</p>
                            </div>
                        )}

                        <button 
                            onClick={handleLogout}
                            className={`${styles.button} ${styles.deleteButton}`}
                            style={{
                                backgroundColor: "#3498db", // Red color for delete
                                color: "#fff",
                                padding: "0.5rem 1rem",
                                border: "none",
                                borderRadius: "5px",
                            }}
                            state="enabled"
                        >
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>

                    <div className="grid gap-12 md:grid-cols-3">
                        <div>
                            <h2 className="container text-center mt-4">Your Wikis: </h2>
                            <div className="text-end me-2 mb-4">
                                <LinkButton
                                    btn_type={"btn-primary"}
                                    button_text="Create Wiki"
                                    state="enabled"
                                    link="/wiki/wiki_form"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {userWikis.length > 0 ? (
                                userWikis.map(wiki => (
                                    <div 
                                        key={wiki.id}
                                        className="group p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200"
                                        onClick={() => window.location.href = `/wiki/${wiki.id}`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                                    {wiki.title}
                                                </h3>
                                                <p className="text-gray-600 mt-1">{wiki.description}</p>
                                            </div>
                                            <div className="mt-2 sm:mt-0 text-sm text-gray-500 sm:text-right">
                                                <p>Creado: {new Date(wiki.createdAt).toLocaleDateString()}</p>
                                                <p>Actualizado: {new Date(wiki.lastModified).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-xl">
                                    <h5 className="text-gray-600">You haven't created any wiki yet</h5>
                                    <p className="text-blue-500 font-medium mt-2">Get started by creating your first wiki!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </ClientOnly>
);
};

export default UserProfile;



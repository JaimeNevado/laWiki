import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default async function NewArticleForm(article_id) {
    const [formData, setFormData] = useState({ name: '', text: '', googleMaps: '' });
    const [success, setSuccess] = useState(false);

    const url = `${process.env.NEXT_PUBLIC_ARTICLES_API_URL}/api/v1/articles/{article_id}`;
    let currentArticle = null;
    currentArticle = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status}`);
            }
            return response.json(); // Convertimos la respuesta a JSON
        })
        .then(data => {
            console.log("Artículo recibido:", data); // Aquí obtienes el artículo en JSON
        })
        .catch(error => {
            console.error("Error al obtener el artículo:", error.message);
        });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        if (currentArticle) {
            setFormData({
                googleMaps: currentArticle.googleMaps,
                text: currentArticle.text,
                name: currentArticle.name,
            });
        }
    }, [currentArticle]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const articuloEditado = { ...currentArticle, ...formData }
        const articuloEditadoVersiones = actualizarVersion(articuloEditado);

        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json", // Indicamos que enviamos JSON
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(articuloEditadoVersiones) //Esto es lo que se actualizará 
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la petición: ${response.status}`);
                }
                return response.json(); // Parseamos la respuesta como JSON
            })
            .then(result => {
                console.log("Éxito:", result); // Mostramos el resultado en consola
            })
            .catch(error => {
                console.error("Error al realizar la petición PUT:", error.message);
            });


    };

    function actualizarVersion(currentArticle) {
        const versionAMeter = {
            version: versions.length > 0 ? versions[versions.length - 1].version + 1 : 1, // Suma 1 a la última versión
            shortText: currentArticle.shortText,
            text: currentArticle.text,
            date: "",
        };
        const nuevoArticulo = { ...currentArticle, versions: [...currentArticle.versions, versionAMeter] };
        currentArticle = nuevoArticulo;

        return currentArticle;
    }

    return (
        <div className="container mt-5">
            <h2>Create a New Article</h2>
            {success && <div className="alert alert-success">Article created successfully!</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={currentArticle.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="text" className="form-label">Description</label>
                    <input
                        type="text"
                        className="form-control"
                        id="text"
                        name="text"
                        value={currentArticle.text}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="google_maps" className="form-label">Content</label>
                    <textarea
                        className="form-control"
                        id="google_maps"
                        name="google_maps"
                        rows="5"
                        value={currentArticle.google_maps}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Edit Article</button>
            </form>
        </div>
    );
}
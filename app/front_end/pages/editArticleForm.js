import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from "next/image";
export default function EditArticleForm() {
    const router = useRouter();
    const { article_id } = router.query; // Get article_id from the URL query parameters
    const [formData, setFormData] = useState({ name: '', text: '', googleMaps: '', image : '' });
    const [success, setSuccess] = useState(false);
    const [currentArticle, setCurrentArticle] = useState(null); // Usamos el estado para currentArticle

    useEffect(() => {
        if (article_id) {
            const url = `http://localhost:13001/api/v1/articles/${article_id}`;
            const fetchArticle = async () => {
                try {
                    const response = await fetch(url, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        },
                    });
                    if (!response.ok) {
                        throw new Error(`Error en la petición: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log("Artículo recibido:", data);
                    setCurrentArticle(data); // Actualizamos el estado con el artículo recibido
                } catch (error) {
                    console.error("Error al obtener el artículo:", error.message);
                }
            };
            fetchArticle();
        }
    }, [article_id]);

    // Actualizar formData cuando currentArticle cambia
    useEffect(() => {
        if (currentArticle) {
            setFormData({
                googleMaps: currentArticle.googleMaps || '',
                text: currentArticle.text || '',
                name: currentArticle.name || '',
            });
        }
    }, [currentArticle]); // Se ejecuta cada vez que se actualiza currentArticle

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejar la edición del artículo
    const handleSubmit = (e) => {
        e.preventDefault();
        const articuloEditado = { ...currentArticle, ...formData, date : "2024-11-15T22:27:54+0000",
            images: formData.image ? [...(currentArticle.images || []), formData.image] : currentArticle.images};
        console.log("Articulo editado", articuloEditado);
        const articuloEditadoVersiones = actualizarVersion(articuloEditado);
        console.log("Articulo editado con versiones:", articuloEditado);
        const url = `http://localhost:13001/api/v1/articles/${article_id}`;
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json" // Indicamos que enviamos JSON
            },
            body: JSON.stringify(articuloEditadoVersiones) // Esto es lo que se actualizará
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la petición: ${response.status}`);
                }
                return response.json(); // Parseamos la respuesta como JSON
            })
            .then(result => {
                console.log("Éxito:", result); // Mostramos el resultado en consola
                setSuccess(true); // Mostramos mensaje de éxito
            })
            .catch(error => {
                console.error("Error al realizar la petición PUT:", error.message);
            });
    };

    // Actualizar la versión del artículo
    function actualizarVersion(currentArticle) {
        const versions = currentArticle.versions || []; // Asegurarnos de que existe `versions`
        const versionAMeter = {
            version: versions.length > 0 ? versions[versions.length - 1].version + 1 : 1, // Sumar 1 a la última versión
            short_text: currentArticle.short_text,
            text: currentArticle.text,
            date: "2024-11-15T22:27:54+0000"
        };
        console.log("VersionAMeter :", versionAMeter);
        const nuevoArticulo = { ...currentArticle, versions: [...versions, versionAMeter] };
        return nuevoArticulo;
    }

    // Si el artículo no ha sido cargado, mostramos un mensaje de carga
    if (!currentArticle) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Edit Article</h2>
            {success && <div className="alert alert-success">Article updated successfully!</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name} // Usamos formData para el valor
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
                        value={formData.text} // Usamos formData para el valor
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
                        value={formData.googleMaps} // Usamos formData para el valor
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div className="form-element mb-3">
                <label htmlFor="image" className="form-label">Logo:</label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    className="form-control"
                    onChange={handleChange}
                />
                </div>
                <button type="submit" className="btn btn-primary ">Edit Article</button>
            </form>

        <div className="container mt-5 mb-5">
            <div className="row">
                {currentArticle.images.map((image, index) => (
                    <div className="col-md-4" key={index}>
                        <Image
                            src={image}
                            width={250}
                            height={250}
                            className="img-fluid"
                            alt={`Image ${index + 1}`}
                        />
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
}

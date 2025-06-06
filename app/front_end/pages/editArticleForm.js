import { useRouter } from 'next/router';
import ArticleForm from '../components/article_form';

export default function EditArticle() {
  const router = useRouter();
  const { article_id } = router.query;
  
  return <ArticleForm requestType="PUT" articleId={article_id} />;
}



// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Image from "next/image";
// export default function EditArticleForm() {
//     const router = useRouter();
//     const { article_id } = router.query; // Get article_id from the URL query parameters
//     const [formData, setFormData] = useState({ short_text: '', text: '', googleMaps: '', author: '' });
//     const [success, setSuccess] = useState(false);
//     const [currentArticle, setCurrentArticle] = useState(null); // Usamos el estado para currentArticle
//     const [images, setImages] = useState([]);
//     useEffect(() => {
//         if (article_id) {
//             const url = `${process.env.NEXT_PUBLIC_ARTICLES_API_URL}/api/v1/articles/${article_id}`;
//             const fetchArticle = async () => {
//                 try {
//                     const response = await fetch(url, {
//                         method: "GET",
//                         headers: {
//                             "Content-Type": "application/json"
//                         },
//                     });
//                     if (!response.ok) {
//                         throw new Error(`Error en la petición: ${response.status}`);
//                     }
//                     const data = await response.json();
//                     console.log("Artículo recibido:", data);
//                     setCurrentArticle(data); // Actualizamos el estado con el artículo recibido
//                 } catch (error) {
//                     console.error("Error al obtener el artículo:", error.message);
//                 }
//             };
//             fetchArticle();
//         }
//     }, [article_id]);

//     // Actualizar formData cuando currentArticle cambia
//     useEffect(() => {
//         if (currentArticle) {
//             setFormData({
//                 googleMaps: currentArticle.googleMaps || '',
//                 text: currentArticle.text || '',
//                 short_text: currentArticle.short_text || '',
//                 author: currentArticle.author || ''
//             });
//         }
//     }, [currentArticle]); // Se ejecuta cada vez que se actualiza currentArticle

//     // Manejar cambios en el formulario
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     // Manejar la edición del artículo
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const imagesFormData = new FormData();
//         images.forEach((image, index) => {
//             imagesFormData.append(`files`, image);
//         });

//         // Prossesing images
//         let imageUrls = [];
//         if (images.length > 0) {
//             console.log("ImagesFormData:", imagesFormData);
//             // Subir las imágenes y obtener las URLs
//             const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_ARTICLES_API_URL}/api/v1/upload_images`, {
//                 method: "POST",
//                 headers: {
//                     "Authorization": `Bearer ${localStorage.getItem("token")}`
//                 },
//                 body: imagesFormData,
//             });

//             if (!uploadResponse.ok) {
//                 throw new Error(`Failed to upload images: ${uploadResponse.statusText}`);
//             }
//             const uploadResult = await uploadResponse.json();
//             imageUrls = uploadResult.urls;
//         }
//         console.log("ImageUrls:", imageUrls);
//         const articuloEditado = {
//             ...currentArticle,
//             ...formData,
//             date: new Date().toISOString(),
//             images: imageUrls.length > 0 ? imageUrls : currentArticle.images
//         };


//         console.log("Articulo editado", articuloEditado);
//         const articuloEditadoVersiones = actualizarVersion(articuloEditado);
//         console.log("Articulo editado con versiones:", articuloEditado);
//         const url = `${process.env.NEXT_PUBLIC_ARTICLES_API_URL}/api/v1/articles/${article_id}`;
//         fetch(url, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json", // Indicamos que enviamos JSON
//                 "Authorization": `Bearer ${localStorage.getItem("token")}`,
//             },
//             body: JSON.stringify(articuloEditadoVersiones) // Esto es lo que se actualizará
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`Error en la petición: ${response.status}`);
//                 }
//                 return response.json(); // Parseamos la respuesta como JSON
//             })
//             .then(result => {
//                 console.log("Éxito:", result); // Mostramos el resultado en consola
//                 setSuccess(true); // Mostramos mensaje de éxito
//                 router.push(`/article_page?id=${article_id}`); // Redirigimos a la página del artículo
//             })
//             .catch(error => {
//                 console.error("Error al realizar la petición PUT:", error.message);
//             });
//     };

//     // Actualizar la versión del artículo
//     function actualizarVersion(currentArticle) {
//         const versions = currentArticle.versions || []; // Asegurarnos de que existe `versions`
//         const versionAMeter = {
//             version: versions.length > 0 ? versions[versions.length - 1].version + 1 : 1, // Sumar 1 a la última versión
//             short_text: currentArticle.short_text,
//             text: currentArticle.text,
//             googleMaps: currentArticle.googleMaps,
//             author: currentArticle.author,
//             date: new Date(),
//             images: currentArticle.images
//         };
//         console.log("VersionAMeter :", versionAMeter);
//         const nuevoArticulo = { ...currentArticle, versions: [...versions, versionAMeter] };
//         return nuevoArticulo;
//     }

//     const handleFileChange = (e) => {
//         const files = Array.from(e.target.files);
//         setImages(files);
//     };
//     // Si el artículo no ha sido cargado, mostramos un mensaje de carga
//     if (!currentArticle) {
//         return <div>Cargando...</div>;
//     }

//     return (
//         <div className="container mt-5" style={{backgroundColor: "#fefefecc"}}>
//             <h2>Edit Article {formData.short_text}</h2>
//             {success && <div className="alert alert-success">Article updated successfully!</div>}
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                     <label htmlFor="short_text" className="form-label">Brief description</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         id="short_text"
//                         name="short_text"
//                         value={formData.short_text} // Usamos formData para el valor
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="mb-3">
//                     <label htmlFor="text" className="form-label">Description</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         id="text"
//                         name="text"
//                         value={formData.text} // Usamos formData para el valor
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="mb-3">
//                     <label htmlFor="googleMaps" className="form-label">Location: </label>
//                     <input
//                         className="form-control"
//                         type="text"
//                         id="googleMaps"
//                         name="googleMaps"
//                         value={formData.googleMaps} // Usamos formData para el valor
//                         onChange={handleChange}
//                     />
//                 </div>
//                 <div className="mb-3">
//                     <label htmlFor="author" className="form-label">Author: </label>
//                     <input
//                         className="form-control"
//                         type="text"
//                         id="author"
//                         name="author"
//                         value={formData.author} // Usamos formData para el valor
//                         onChange={handleChange}
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="images">Images</label>
//                     <input
//                         type="file"
//                         className="form-control"
//                         id="images"
//                         name="images"
//                         accept="image/*"
//                         multiple
//                         onChange={handleFileChange}
//                     />
//                 </div>

//                 <button type="submit" className="btn btn-primary ">Edit Article</button>
//             </form>

//             <div className="container mt-5 mb-5">
//                 <div className="row">
//                     {currentArticle.images.map((image, index) => (
//                         <div className="col-md-4" key={index}>
//                             <Image
//                                 src={image}
//                                 width={250}
//                                 height={250}
//                                 className="img-fluid"
//                                 alt={`Image ${index + 1}`}
//                             />
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

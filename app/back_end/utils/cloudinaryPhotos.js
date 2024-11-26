async function uploadToCloudinary(file) {
	const cloudName = 'digykp2os'; // Reemplaza con tu Cloud Name
	const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

	// Obtén la firma desde tu backend
	const response = await fetch('http://localhost:3000/generate-signature');
	const { signature, timestamp } = await response.json();

	// Crea el FormData con los datos requeridos
	const formData = new FormData();
	formData.append('file', file);
	formData.append('api_key', '369442163139246'); // Reemplaza con tu API Key
	formData.append('timestamp', timestamp);
	formData.append('signature', signature);

	// Envía la solicitud a Cloudinary
	const uploadResponse = await fetch(url, {
		method: 'POST',
		body: formData,
	});

	if (!uploadResponse.ok) {
		throw new Error('Error subiendo el archivo a Cloudinary');
	}

	const data = await uploadResponse.json();
	return data.secure_url; // Devuelve el enlace del archivo subido
}

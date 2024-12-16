export default async function fetchData(url, setData, setError) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url} - Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched data:', data); // Verifica el formato de los datos
    setData(data);
  } catch (err) {
    console.error("Fetch error:", err);
    setError(err.message);
  }
}

export default async function fetchData(url, setData, setError) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
      }
      const data = await response.json();
      setData(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    }
  }
  
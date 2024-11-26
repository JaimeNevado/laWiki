import { useState } from "react";
import { useRouter } from "next/router";

function useUploadImage() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file) => {
    if (!file) return null;
    setIsUploading(true);

    try {
      // Replace with actual upload logic
      const uploadImageToCloud = async (file) => {
        // Mock: Simulate an upload delay
        return new Promise((resolve) =>
          setTimeout(() => resolve("https://raw.githubusercontent.com/ijsto/reactnextjssnippets/master/images/logo02.png"), 1000)
        );
      };
      const url = await uploadImageToCloud(file);
      return url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading };
}

function useWikiForm(initialState) {
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  return {
    formData,
    handleInputChange,
    handleFileChange,
  };
}

async function submitWiki(payload) {
  try {
    const response = await fetch("http://127.0.0.1:13000/api/v1/wikis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit wiki: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API submission error:", error);
    throw error;
  }
}

function WikiForm() {
  const router = useRouter(); // Initialize router
  const { formData, handleInputChange, handleFileChange } = useWikiForm({
    name: "",
    description: "",
    bg_image: null,
    logo: null,
  });

  const { uploadImage, isUploading } = useUploadImage();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Preprocess images
      const bg_image_url = await uploadImage(formData.bg_image);
      const logo_url = await uploadImage(formData.logo);

      // Prepare the payload, including the hardcoded author
      const payload = {
        name: formData.name,
        description: formData.description,
        bg_image: bg_image_url,
        logo: logo_url,
        author: "Front End Fake Author For Wiki", // Hardcoded author field
      };

      // Submit the form
      const result = await submitWiki(payload);

      if (result.inserted_id) {
        // Show success message and navigate to the wiki page
        if (window.confirm("Wiki created successfully! Click OK to view it.")) {
          router.push(`/wiki?wikiID=${result.inserted_id}`);
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error creating wiki:", error);
      alert("Error creating wiki.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="logo">Logo:</label>
        <input
          type="file"
          id="logo"
          name="logo"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <div>
        <label htmlFor="bg_image">Background Image:</label>
        <input
          type="file"
          id="bg_image"
          name="bg_image"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <button type="submit" disabled={isUploading}>
        {isUploading ? "Uploading..." : "Create Wiki"}
      </button>
    </form>
  );
}

export default WikiForm;
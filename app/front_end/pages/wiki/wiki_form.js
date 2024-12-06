import { useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMemo } from "react";
import Image from "next/image";
import {uploadToCloudinary} from "../../components/utils/cloudinaryPhotos"




function useUploadImage() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file, current_img) => {
    if (!file && !current_img) {
      return "https://raw.githubusercontent.com/ijsto/reactnextjssnippets/master/images/logo02.png";
    } else if (!file && current_img) {
      return current_img;
    }
    setIsUploading(true);

    try {
      const url = await uploadToCloudinary(file);
      console.log("Cloudinary URL ", url);
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

  useEffect(() => {
    setFormData(initialState); // Update only if the actual initialState changes
  }, [initialState]); // Dependency ensures this runs only when initialState changes

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

async function modifyWiki(wikiID, payload) {
  try {
    const response = await fetch(`http://127.0.0.1:13000/api/v1/wikis/${wikiID}`, {
      method: "PUT",
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
  const { wikiID } = router.query;
  const [wiki, setWiki] = useState(null);
  useEffect(() => {
    if (wikiID) {
      fetch(`http://127.0.0.1:13000/api/v1/wikis/${wikiID}`)
        .then((res) => res.json())
        .then((data) => setWiki(data))
        .catch((err) => console.error(err));
    }
  }, [wikiID]);
  // console.log("from wikiform. id: ", wikiID, " wiki: ", wiki);
  const initData = useMemo(() => {
    return wiki
      ? {
        _id: wiki._id,
        name: wiki.name || "",
        description: wiki.description || "",
        author: wiki.author || "",
        bg_image: null,
        bg_image_url: wiki.bg_image || "",
        logo: null,
        logo_url: wiki.logo || "",
      }
      : {
        name: "",
        description: "",
        author: "",
        bg_image: null,
        logo: null,
      };
  }, [wiki]);

  const { formData, handleInputChange, handleFileChange } = useWikiForm(initData);
  // console.log("after setting init data! ", formData);
  const { uploadImage, isUploading } = useUploadImage();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Preprocess images
      const bg_image_url = await uploadImage(formData.bg_image, formData.bg_image_url);
      const logo_url = await uploadImage(formData.logo, formData.logo_url);

      // Prepare the payload, including the hardcoded author
      const payload = {
        name: formData.name,
        description: formData.description,
        bg_image: bg_image_url,
        logo: logo_url,
        author: formData.author
      };

      // Submit the form
      let result;
      if (wikiID) {
        result = await modifyWiki(wikiID, payload);
      } else {
        result = await submitWiki(payload);
      }
      if (result.inserted_id) {
        // Show success message and navigate to the wiki page
        if (window.confirm("Wiki saved successfully! Click OK to view it.")) {
          router.push(`/wiki?wikiID=${result.inserted_id}`);
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error saving wiki:", error);
      alert("Error saving wiki.");
    }
  };

  const handleDelete = async() => {    
    try {
      // removing wiki itself
      let response = await fetch(`http://127.0.0.1:13000/api/v1/wikis/${wikiID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to remove wiki: ${response.statusText}`);
      }

      // removing articles
      response = await fetch (`http://127.0.0.1:13001/api/v1/articles/wiki/${wikiID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to remove articles of the wiki wiki: ${response.statusText}`);
      }
      alert("Wiki and related articles removed successfully!");
      router.push(`/`);
    } catch (error) {
      console.error("API submission error:", error);
      throw error;
    }
}

  return (
    <>
      <div className="row align-self-center">
        <div className="col-9 d-flex align-items-center" >
          <form className="container mt-5 mx-0 wiki-form" onSubmit={handleSubmit}>
            <div className="fs-2 fw-medium text-center">{wikiID ? (`Edit Wiki \"${initData.name}\"`) : ("Create New Wiki")}</div>
            <div className="form-element">
              <label htmlFor="name" className="form-label">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-element">
              <label htmlFor="description" className="form-label">Description:</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-element">
              <label htmlFor="author" className="form-label">Author:</label>
              <textarea
                id="author"
                name="author"
                className="form-control"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-element">
              <label htmlFor="logo" className="form-label">Logo:</label>
              <input
                type="file"
                id="logo"
                name="logo"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
            <div className="form-element">
              <label htmlFor="bg_image" className="form-label">Background Image:</label>
              <input
                type="file"
                id="bg_image"
                name="bg_image"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
            <div className="form-element submit-button">
              <button type="submit" className="my-4 btn btn-primary" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Save Wiki"}
              </button>
            </div>
          </form>
        </div>
        {/* Current Images */}
        <div className="col-3 d-flex align-items-center">
          <div className="col">
            <div className="row text-center mb-5">
              {formData.logo_url ? (
                <>
                  <div className="fs-6">
                    Current Wiki Logo:
                  </div>
                  <div className="mx-auto d-block" style={{ maxWidth: "250px" }}>
                    <Image
                      src={formData.logo_url}
                      className="img-fluid"
                      width={0}
                      height={0}
                      sizes='25vw'
                      alt="Current wiki logo"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="row">
              {formData.bg_image_url ? (
                <>
                  <div className="fs-6 text-center">
                    Current Wiki Background:
                  </div>
                  <div className="mx-auto d-block" style={{ maxWidth: "250px" }}>
                    <Image
                      src={formData.bg_image_url}
                      className="img-fluid"
                      width={0}
                      height={0}
                      sizes='25vw'
                      alt="Current wiki background"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-9 text-center">
          <button 
            className="btn btn-danger" 
            onClick={() => {
              if (window.confirm("Are you sure want to remove this Wiki?\nAll data will be lost!")) {
                handleDelete();
              }
            }}
          >
            {`Delete Wiki \"${initData.name}\"`}
          </button>
        </div>
      </div>
    </>
  );
}

export default WikiForm;
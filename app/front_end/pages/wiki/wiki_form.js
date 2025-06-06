import { use, useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMemo } from "react";
import Image from "next/image";
import styles from "../../css/WikiForm.module.css";
import router from "next/router";
import { refreshNotifications } from "../../components/notifications/notifications_bell.js";


function useWikiForm(initialState) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    let email = localStorage.getItem("email");
    const userRole = localStorage.getItem("userDB");
    let role = "";
    if (userRole){
      role = JSON.parse(userRole).level;
    } 

    if (email) {
      // console.log("from wikiForm -> useWikiForm from if user: ", email);
      refreshNotifications(email);
    }
    if (role !== "admin") {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    setFormData(initialState);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file.size >= 10485760) {
      setFormData((prev) => ({ ...prev, [name]: null }));
      alert("File size too large. Maximum size is 10MB.");
      return;
    } else {
      setFormData((prev) => ({ ...prev, [name]: file }));
    }
  };

  return {
    formData,
    handleInputChange,
    handleFileChange,
  };
}

async function submitWiki({ wikiID, payload } = {}) {
  try {
    let response;
    if (!wikiID) {
      // Create new Wiki
      // console.log("from submitWiki. id: ", wikiID, " payload: ", Array.from(payload.entries()));
      response = await fetch(`${process.env.NEXT_PUBLIC_WIKI_API_URL}/api/v2/wikis`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: payload, // Send FormData directly, don't stringify
      });
    } else {
      // Update existing Wiki
      // console.log("from submitWiki. id: ", wikiID, " payload: ", Array.from(payload.entries()));
      response = await fetch(`${process.env.NEXT_PUBLIC_WIKI_API_URL}/api/v2/wikis/${wikiID}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: payload, // Send FormData directly, don't stringify
      });
    }

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
  const router = useRouter();
  const { wikiID } = router.query;
  const [wiki, setWiki] = useState(null);
  const [deleteButtonVisible, setDeleteButtonVisible] = useState(false);
  const [storedUser, setStoredUser] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (wikiID) {
      fetch(`${process.env.NEXT_PUBLIC_WIKI_API_URL}/api/v1/wikis/${wikiID}`)
        .then((res) => res.json())
        .then((data) => setWiki(data))
        .catch((err) => console.error(err));

      setDeleteButtonVisible(true);
      // console.log("from WikiForm. wiki.author: ", wiki?.author, " storedUser.name: ", storedUser?.name, " canEdit: ", canEdit);
    } else {
      setDeleteButtonVisible(false);
      setCanEdit(true);
    }
    setStoredUser(JSON.parse(localStorage.getItem("user")));
    // console.log("wikiform, id updated!");
  }, [wikiID]);

  const initData = useMemo(() => {
    // const storedUser = JSON.parse(localStorage.getItem("user"));
    return wiki
      ? {
        _id: wiki._id,
        name: wiki.name || "",
        description: wiki.description || "",
        author: storedUser?.name || wiki.author || "",
        bg_image: null,
        bg_image_url: wiki.bg_image || "",
        logo: null,
        logo_url: wiki.logo || "",
      } : {
        name: "",
        description: "",
        author: storedUser?.name || "",
        bg_image: null,
        logo: null,
      };
  }, [wiki, storedUser]);

  const { formData, handleInputChange, handleFileChange } = useWikiForm(initData);

  // reinicializando el formulario
  useEffect(() => {
    if (!wiki){
      setCanEdit(true);  
    } else {
      setCanEdit(storedUser && storedUser.name === wiki.author);
      const wikiData = {
        _id: wiki._id,
        name: wiki.name || "",
        description: wiki.description || "",
        author: storedUser?.name || wiki.author || "",
        bg_image: null,
        bg_image_url: wiki.bg_image || "",
        logo: null,
        logo_url: wiki.logo || "",
      };

      Object.entries(wikiData).forEach(([name, value]) => {
        handleInputChange({
          target: { name, value }
        });
      });
    }

    const syntheticEvent = {
      target: {
        name: 'author',
        value: storedUser?.name
      }
    };    
    handleInputChange(syntheticEvent);

    // console.log("wikiform, storedUser or wiki updated!");
  }, [storedUser, wiki]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("wikiID", wikiID);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("author", formData.author);

      // Append files if they exist
      if (formData.bg_image) {
        formDataToSend.append("bg_image", formData.bg_image);
      }
      if (formData.logo) {
        formDataToSend.append("logo", formData.logo);
      }

      // Submit the form
      const result = await submitWiki({ wikiID: wikiID, payload: formDataToSend });
      if (result.inserted_id) {
        if (window.confirm("Wiki saved successfully! Click OK to view it.")) {
          router.push(`/wiki/${result.inserted_id}`);
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error saving wiki.");
    }
  };

  const handleDelete = async () => {
    try {
      // removing wiki itself
      const response = await fetch(`${process.env.NEXT_PUBLIC_WIKI_API_URL}/api/v1/wikis/${wikiID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        alert(`Failed to remove wiki. ${response.statusText}`);
        router.push(`/login`);
        // throw new Error(`Failed to remove wiki: ${response.statusText}`);
      }

      // removing articles
      const response_art = await fetch(`${process.env.NEXT_PUBLIC_ARTICLES_API_URL}/api/v1/articles/wiki/${wikiID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response_art.ok) {
        alert(`Failed to remove wiki. ${response.statusText}`);
        router.push(`/login`);
        // throw new Error(`Failed to remove articles of the wiki wiki: ${response.statusText}`);
      } else {
        alert("Wiki and related articles removed successfully!");
        router.push(`/`);
      }
    } catch (error) {
      console.error("API submission error:", error);
      throw error;
    }
  }

  return (
    <>
      <div className={`row mx-0 pt-3 mt-1 align-self-center ${styles.wikipage}`}>
        <div className="col-9 d-flex align-items-center">
          <form
            className={`container mt-5 mx-0 ${styles.wikiform}`}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            {/* Form title */}
            <div className="fs-2 fw-medium text-center">
              {wikiID ? `Edit Wiki \"${initData.name}\"` : "Create New Wiki"}
            </div>
            <div className={`${styles.formelement}`}>
              <label htmlFor="name" className="form-label">
                Name:
              </label>
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
            <div className={`${styles.formelement}`}>
              <label htmlFor="description" className="form-label">
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                rows={10}
                className="form-control"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={`${styles.formelement}`}>
              <label htmlFor="author" className="form-label">
                Author:
              </label>
              <input
                type="text"
                id="author"
                name="author"
                className="form-control"
                value={formData.author}
                readOnly
              />
            </div>
            <div className={`${styles.formelement}`}>
              <label htmlFor="logo" className="form-label">
                Logo:
              </label>
              <input
                type="file"
                id="logo"
                name="logo"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
            <div className={`${styles.formelement}`}>
              <label htmlFor="bg_image" className="form-label">
                Background Image:
              </label>
              <input
                type="file"
                id="bg_image"
                name="bg_image"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
            {canEdit && (
              <div className={`${styles.formelement} ${styles.submitbutton}`}>
                <button type="submit" className="my-4 btn btn-dark">
                  Save Wiki
                </button>
              </div>
            )}
          </form>
        </div>
        <div className="col-3 d-flex align-items-center">
          <div className="col">
            <div className="row text-center mb-5">
              {formData.logo_url && (
                <>
                  <div className="fs-6">Current Wiki Logo:</div>
                  <div className="mx-auto d-block" style={{ maxWidth: "250px" }}>
                    <Image
                      src={formData.logo_url}
                      className="img-fluid"
                      width={0}
                      height={0}
                      sizes="25vw"
                      alt="Current wiki logo"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="row">
              {formData.bg_image_url && (
                <>
                  <div className="fs-6 text-center">Current Wiki Background:</div>
                  <div className="mx-auto d-block" style={{ maxWidth: "250px" }}>
                    <Image
                      src={formData.bg_image_url}
                      className="img-fluid"
                      width={0}
                      height={0}
                      sizes="25vw"
                      alt="Current wiki background"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {deleteButtonVisible && (
        <div className="row mt-2">
          <div className="col-9 text-center">
            {canEdit && (
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm("Are you sure you want to remove this Wiki?\nAll data will be lost!")) {
                    handleDelete();
                  }
                }}
              >
                {`Delete Wiki \"${initData.name}\"`}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default WikiForm;

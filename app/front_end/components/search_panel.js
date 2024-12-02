import { useState } from "react";
import styles from "../css/SearchPanel.module.css";

const default_values = {
    name: "",
    // wiki_name: "",
    author: "",
    date_from: "",
    date_to: "",
}

const SearchPanel = ({ onSearch }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchParams, setSearchParams] = useState(default_values);

    const togglePanel = () => setIsOpen(!isOpen);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        onSearch(searchParams);
        setSearchParams(default_values);
        togglePanel(); // Optionally close the panel after search
    };

    return (
        <div>
            <button onClick={togglePanel} className="btn btn-outline-success">
                Tools
            </button>

            {isOpen && (
                <div className={styles.panel}>

                    <button className={styles.close_btn} onClick={togglePanel}>X</button>
                    <span className="fs-3 fw-medium">Refined search</span>

                    <form>
                        <div className={styles.field}>
                            <label>Article Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={searchParams.name}
                                onChange={handleChange}
                            />
                        </div>
                        {/* <div className={styles.field}>
                            <label>Wiki Name:</label>
                            <input
                                type="text"
                                name="wiki_name"
                                value={searchParams.wiki_name}
                                onChange={handleChange}
                            />
                        </div> */}
                        <div className={styles.field}>
                            <label>Author:</label>
                            <input
                                type="text"
                                name="author"
                                value={searchParams.author}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Date From:</label>
                            <input
                                type="date"
                                name="date_from"
                                value={searchParams.date_from}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Date To:</label>
                            <input
                                type="date"
                                name="date_to"
                                value={searchParams.date_to}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="button" onClick={handleSearch} className="btn btn-outline-success">
                            Search
                        </button>
                    </form>
                </div>
            )
            }
        </div >
    );
};

export default SearchPanel;

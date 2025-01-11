import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchPanel from "../components/search_panel";
import NotificationBell from './notifications/notifications_bell';

function Nav({ onSearch }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem("token");
      setEmail(localStorage.getItem("email"));
      setToken(storedToken);
      setLoading(false);

      const handleStorageChange = (event) => {
        if (event.key === "token") {
          setToken(event.newValue);
        }
      };

      const handleTokenUpdated = () => {
        const updatedToken = localStorage.getItem("token");
        setToken(updatedToken);
      };

      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('tokenUpdated', handleTokenUpdated);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('tokenUpdated', handleTokenUpdated);
      };
    }

  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchQuery = formData.get('search');
    const simpleQuery = { "name": searchQuery };
    onSearch(simpleQuery);
  }

  if (loading) {
    return <div>Loading...</div>; // Show loading state while waiting for the token
  }
  return (
    <nav style={{ width: "100%" }} className="navbar navbar-expand-lg bg-body-subtle">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active fs-5 me-1" aria-current="page" href="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5 me-1" href="/articles">Article</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5 me-1" href="/profile">My Profile</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5 me-1" href="/comment">My comments</Link>
            </li>
          </ul>
          <form className="d-flex" role="search" onSubmit={handleSubmit}>
            <input name="search" className="form-control me-2" type="search" placeholder="Search article" aria-label="Search" />
            <button className="btn btn-outline-success fs-5" type="submit">Search</button>
          </form>
          <div className='ms-2'>
            <SearchPanel onSearch={onSearch} />
          </div>
          {token ? (
            <div className="ms-3 position-relative">
              <Link className="nav-link" href="/notification">
                <NotificationBell user_id={email} />
              </Link>
            </div>
          ) : (
            <div className="ms-3">
              <Link href="/login">
                <button className="btn btn-outline-dark">Login</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
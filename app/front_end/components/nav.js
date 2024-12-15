import Link from 'next/link';
import SearchPanel from "../components/search_panel";

function Nav({ onSearch}) {

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchQuery = formData.get('search');
    const simpleQuery = {"name": searchQuery};
    onSearch(simpleQuery);
  }

  return (
    <nav style={{ width: "100%" }} className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" href="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/wiki">Wiki</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/NewArticleForm">My Articles</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/article_page">Article</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/my-wikis">My Wikis</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/profile">My Profile</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/comment">Comment</Link>
            </li>
          </ul>
          <form className="d-flex" role="search" onSubmit={handleSubmit}>
            <input name="search" className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
          <div className='ms-2'>
            <SearchPanel onSearch={onSearch} />
          </div>
        </div>
      </div>
    </nav>
  );
}


export default Nav;

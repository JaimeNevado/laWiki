import Nav from "./nav";
import Header from "./header";
import Footer from "./footer";
import { useRouter } from "next/router";


const Layout = ({ children }) => {
  const router = useRouter();

  const handleSearch = (query) => {
    if (query) {
      // Example: Navigate to a search results page
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div id="main_wrapper" className="layoutWrapper">
      <div className="layout">
        <Header />
        <Nav onSearch={handleSearch} />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout
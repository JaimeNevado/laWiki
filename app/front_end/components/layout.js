import Nav from "./nav";
import Header from "./header";
import Footer from "./footer";
import "../css/layout.css"
import "../css/page_content.css"

const Layout = ({ children }) => {
  return (
    <div className="layoutWrapper">
      <div className="layout">
        <div className="page-content">
          <Header />
        </div>
        <div className="page-content">
          <Nav />
        </div>
        <main>{children}</main>
        <div className="page-content">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout
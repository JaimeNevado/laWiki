import Nav from "./nav";
import Header from "./header";
import Footer from "./footer";

const Layout = ({ children }) => {
  return (
    <div id="main_wrapper" className="layoutWrapper">
      <div className="layout">
          <Header />
          <Nav />
          <main>{children}</main>
          <Footer />
      </div>
    </div>
  );
};

export default Layout
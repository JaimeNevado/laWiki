import Nav from "./nav";
import Header from "./header";
import Footer from "./footer";
import "../css/layout.css"

const Layout = ({ children }) => {
  return (
    <div className="layoutWrapper">
    <div className="layout">
      <Header/>
      <Nav />      
      <main>{children}</main>
      <Footer/>
    </div>
    </div>
  );
};

export default Layout
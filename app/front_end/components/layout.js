import Nav from "./nav";
import Header from "./header";
import Footer from "./footer";

const Layout = ({ children }) => {
  return (
    <div>
      <Header/>
      <Nav />      
      <main>{children}</main>
      <Footer/>
    </div>
  );
};

export default Layout
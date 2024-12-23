import Nav from "./nav";
import Header from "./header";
import Footer from "./footer";
import { useRouter } from "next/router";
import ParseQuery from './utils/parse_search_query';
import styles from "../css/Layout.module.css";

const Layout = ({ children }) => {
  const router = useRouter();

  const handleSearch = (params) => {
    // console.log("Search Parameters: ", params);
    const query = ParseQuery({ query: params });
    // console.log("Search Parameters after processing: ", query);
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <div id="main_wrapper" className={`${styles.layoutWrapper}`}>
      <div className={`${styles.layout}`}>
        <Header />
        <div className={`${styles.stickyNav}`}>
          <Nav onSearch={handleSearch} />
        </div>
        <main className={`${styles.mainDiv}`}>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout
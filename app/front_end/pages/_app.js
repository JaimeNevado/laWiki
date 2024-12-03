import Layout from "../components/layout";
import "../css/footer.css"
import "../css/layout.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/wiki_page.css";
import "../css/wiki_form.css"
//import "../../css/ArticlePage.css";
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
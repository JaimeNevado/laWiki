import Layout from "../components/Layout";
// import '../styles/globals.css'; // Add your global styles here

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
import Layout from "../components/layout";
// import '../styles/globals.css'; // Add your global styles here

function MyApp({ Component, pageProps }) {
  return (
    
    <Layout>
      <link rel="icon" href="/static/V.ico" type="image/x-icon" />
      <Component {...pageProps} />
      
    </Layout>
  );
}

export default MyApp;
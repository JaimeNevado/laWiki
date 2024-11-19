import LikeButton from '../components/like-button';
import Nav from '../components/nav';
import Footer from '../components/footer';


// remove this leater just for test
import Comment from '../components/comment';

function Header({ title }) {
  return <h1>{title ? title : 'Default title'}</h1>;
}
 
export default function HomePage() {
  
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];
  return (
    <div>
      <Header title="Develop. Preview. Ship." />
      {/* <Nav/> */}
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <LikeButton/>
      <Footer/>
    </div>
  );
}
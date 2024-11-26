import 'bootstrap/dist/css/bootstrap.min.css';
import LikeButton from "../components/buttons/like_button";
import LinkButton from '../components/buttons/button_with_link';

export default function HomePage() {
  
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];
  return (
    <div>
      <div className='text-end me-2'>
        <LinkButton button_text="Create Wiki" state="enabled" link="/wiki/wiki_form"/>
      </div>
      {/* <Header title="Develop. Preview. Ship." /> */}
      {/* <Nav/> */}
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <LikeButton/>
      {/* <Footer/> */}
    </div>
  );
}
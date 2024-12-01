import LikeButton from "../components/buttons/like_button";
import LinkButton from '../components/buttons/button_with_link';



export default function HomePage() {
  
  return (
    <div className='page-content'>
      <div className='text-end me-2'>
        <LinkButton button_text="Create Wiki" state="enabled" link="/wiki/wiki_form"/>
      </div>
      <LikeButton/>
    </div>
  );
}
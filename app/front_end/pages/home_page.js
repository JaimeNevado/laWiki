import LikeButton from "../components/buttons/like_button";
import LinkButton from '../components/buttons/button_with_link';

import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/page_content.css"

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
import LikeButton from "../components/buttons/like_button";
import LinkButton from '../components/buttons/button_with_link';
import { useEffect } from "react";



export default function HomePage() {
  useEffect(() => {
    // This code runs on the client side only
    const myDiv = document.getElementById('main_wrapper');
    if (myDiv) {
      myDiv.style.backgroundImage = "none" ;
      myDiv.style.backgroundColor = "#fcfcfc"; 
    } 
  });
  return (
    <>
      <div className='text-end me-2'>
        <LinkButton btn_type={"btn-primary"} button_text="Create Wiki" state="enabled" link="/wiki/wiki_form"/>
      </div>
      <LikeButton/>
    </>
  );
}
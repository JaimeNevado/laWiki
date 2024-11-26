import LikeButton from "../components/like_button";

export default function HomePage() {
  
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];
  return (
    <div>
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
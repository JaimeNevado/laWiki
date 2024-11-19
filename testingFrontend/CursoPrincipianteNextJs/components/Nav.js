import Link from 'next/link';
import { useRouter } from 'next/router'

function Nav() {
  const router = useRouter();

  return (
    <nav>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/Wiki">Wiki</Link></li>
        <li><Link href="/my-articles">My Articles</Link></li>

        <li><Link href="/Article">Article</Link></li>
        <li><Link href="/my-wikis">My Wikis</Link></li>
        <li><Link href="/profile">My Profile</Link></li>
        <li><Link href="/search">Search Bar</Link></li>
        <li><Link href="/Comment">comment</Link></li>
      </ul>
    </nav>
  );
}


export default Nav;

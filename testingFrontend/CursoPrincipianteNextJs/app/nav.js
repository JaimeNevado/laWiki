import  Link from 'next/link';

export default function Nav() {
    return (
      <nav>
        <ul>
          <li><Link href="/wiki">Wiki</Link></li>
          <li><Link href="/my-articles">My Articles</Link></li>

          <li><Link href="/article">Article</Link></li>
          <li><Link href="/my-wikis">My Wikis</Link></li>
          <li><Link href="/profile">My Profile</Link></li>
          <li><Link href="/search">Search Bar</Link></li>
          <li><Link href="./comment">comment</Link></li>
        </ul> 
      </nav>
      );
 }


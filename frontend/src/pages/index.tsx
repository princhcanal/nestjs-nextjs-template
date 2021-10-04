import type { NextPage } from 'next';
import Link from 'next/link';

// TODO: use React Query instead of just axios
const Home: NextPage = () => {
  return (
    <div>
      <Link href="/login">
        <a>Login</a>
      </Link>
      <Link href="/register">
        <a>Register</a>
      </Link>
      <h1>Hello World!</h1>
    </div>
  );
};

export default Home;

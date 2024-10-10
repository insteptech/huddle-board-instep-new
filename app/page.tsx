import type { Metadata, NextPage } from 'next';
import Container from "@mui/material/Container";
import dynamic from 'next/dynamic';

const SignUp = dynamic(() => import('./containers/auth/signUp').then((mod) => mod), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Home Page',
};

const Home: NextPage = () => {
  return (
    <div>
      <Container maxWidth="xxl">
        <SignUp />
      </Container>
    </div>
  );
};

export default Home;


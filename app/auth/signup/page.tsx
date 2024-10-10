import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const SignUpPage = dynamic(() => import('../../containers/auth/signUp').then((mod) => mod), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'SignUp Page',
};

const Login = () => {
  return <SignUpPage />;
};

export default Login;

import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const LoginPage = dynamic(() => import('../../containers/auth/login').then((mod) => mod), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Login Page',
};

const Login = () => {
  return <LoginPage />;
};

export default Login;

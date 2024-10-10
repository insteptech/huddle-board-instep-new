import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const UnauthorizedPage = dynamic(() => import('../containers/unauthorized/unauthorized').then((mod) => mod), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Page Not Found',
};

const Unauthorized = () => {
  return <UnauthorizedPage />;
};

export default Unauthorized;

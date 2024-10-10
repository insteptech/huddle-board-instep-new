import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const PageNotAvailable = dynamic(() => import('../containers/pageNotFound/pageNotFound').then((mod) => mod), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Page Not Found',
};

const PageNotFound = () => {
  return <PageNotAvailable />;
};

export default PageNotFound;

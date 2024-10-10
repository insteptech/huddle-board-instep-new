import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const TokenExpired = dynamic(() => import('../containers/expiredToken/expiredToken').then((mod) => mod), {
    ssr: false,
});

export const metadata: Metadata = {
    title: 'Token Expired',
};

const PageNotFound = () => {
    return <TokenExpired />;
};

export default PageNotFound;

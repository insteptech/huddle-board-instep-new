import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const AppointmentPage = dynamic(() => import('../containers/appointment/page').then((mod) => mod), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Appointments',
};

const Login = () => {
  return <AppointmentPage initialAppointments={[]}/>;
};

export default Login;

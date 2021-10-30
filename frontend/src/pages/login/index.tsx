import { GetStaticProps, NextPage } from 'next';
import { Login } from '../../modules/login/components/Login';

const LoginPage: NextPage = () => <Login />;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      dontShowUser: true,
    },
  };
};

export default LoginPage;

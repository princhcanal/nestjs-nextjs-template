import { GetStaticProps } from 'next';
import { Login } from '../../modules/login/components/Login';
import { CenterLayout } from '../../shared/components/ui/CenterLayout';
import { NextPageWithLayout } from '../_app';

const LoginPage: NextPageWithLayout = () => <Login />;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      dontShowUser: true,
    },
  };
};

LoginPage.getLayout = CenterLayout;

export default LoginPage;

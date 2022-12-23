import { GetStaticProps } from 'next';
import { Register } from '../../modules/register/components/Register';
import { CenterLayout } from '../../shared/components/ui/CenterLayout';
import { NextPageWithLayout } from '../_app';

const RegisterPage: NextPageWithLayout = () => <Register />;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      dontShowUser: true,
    },
  };
};

RegisterPage.getLayout = CenterLayout;

export default RegisterPage;

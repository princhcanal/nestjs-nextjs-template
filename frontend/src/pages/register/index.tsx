import { GetStaticProps, NextPage } from 'next';
import { Register } from '../../modules/register/components/Register';

const RegisterPage: NextPage = () => <Register />;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      dontShowUser: true,
    },
  };
};

export default RegisterPage;

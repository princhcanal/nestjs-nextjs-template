import { Landing } from '../modules/index/components/Landing';
import { Home } from '../modules/index/components/Home';
import { ReactElement } from 'react';
import { AppPropsWithLayout, NextPageWithLayout } from './_app';
import { Layout } from '../shared/components/ui/Layout';
import { CenterLayout } from '../shared/components/ui/CenterLayout';

const Index: NextPageWithLayout = ({ isAuth }: AppPropsWithLayout) => {
  return isAuth ? <Home /> : <Landing />;
};

Index.getLayout = (page: ReactElement<AppPropsWithLayout>) => {
  return page.props.isAuth ? Layout(page) : CenterLayout(page);
};

export default Index;

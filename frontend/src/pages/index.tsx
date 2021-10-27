import type { NextPage } from 'next';
import { useGlobalStore } from '../shared/stores';
import { Landing } from '../modules/index/components/Landing';
import { Home } from '../modules/index/components/Home';
import { useEffect, useState } from 'react';
import { UserDTO } from 'generated-api';

const Index: NextPage = () => {
  const [user, setUser] = useState<UserDTO | undefined>();
  const getUser = useGlobalStore((state) => state.getUser);

  useEffect(() => {
    setUser(getUser());
  }, [getUser]);

  return user ? <Home /> : <Landing />;
};

export default Index;

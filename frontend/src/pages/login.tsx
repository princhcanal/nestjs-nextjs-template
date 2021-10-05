import type { NextPage } from 'next';
import { Input, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { axiosInstance as axios } from '../shared/axios';

interface LoginDTO {
  email: string;
  password: string;
}

const Login: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async (loginDTO: LoginDTO) => {
    try {
      await axios.post('/auth/login', loginDTO);
    } catch (e) {
      throw new Error();
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (e) {
      throw new Error();
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
      />
      <Input
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <Button onClick={() => login({ email, password })}>Submit</Button>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default Login;

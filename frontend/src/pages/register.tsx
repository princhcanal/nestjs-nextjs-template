import { Button, Input } from '@chakra-ui/react';
import { axiosInstance as axios } from '../shared/axios';
import type { NextPage } from 'next';
import React, { useState } from 'react';

interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

const Register: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const register = async (registerDTO: RegisterDTO) => {
    try {
      await axios.post('/auth/register', registerDTO);
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
      <h1>Register</h1>
      <Input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
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
      <Button onClick={() => register({ email, username, password })}>
        Submit
      </Button>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default Register;

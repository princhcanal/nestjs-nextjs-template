import { User } from '@prisma/client';
import { LoginUserDTO } from '../../../src/authentication/dto/login-user.dto';
import { RegisterUserDTO } from '../../../src/authentication/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { HttpStatus } from '@nestjs/common';
import { LoginResponseDTO } from '../../../src/authentication/dto/login-response.dto';
import { AuthenticationController } from '../../../src/authentication/authentication.controller';
import { request } from '../setup';

const authRoute = AuthenticationController.AUTH_API_ROUTE;
const registerRoute = authRoute + AuthenticationController.REGISTER_API_ROUTE;

export const createUser = async (
  user: LoginUserDTO | RegisterUserDTO
): Promise<User> => {
  const newUser: User = {
    id: '',
    email: user.email,
    username: 'test_user',
    createdAt: new Date(),
    updatedAt: new Date(),
    password: await bcrypt.hash(user.password, 10),
    currentHashedRefreshToken: null,
  };

  if (user instanceof RegisterUserDTO) {
    newUser.username = user.username;
  }

  return newUser;
};

export const registerUser = async () => {
  const registerUserDTO: RegisterUserDTO = {
    username: 'test_user',
    email: 'testk@test.com',
    password: 'test',
  };

  const registerUser = await createUser(registerUserDTO);

  const { body } = await request
    .post(registerRoute)
    .send(registerUserDTO)
    .expect(HttpStatus.CREATED);

  const { user, accessToken, refreshToken } = body as LoginResponseDTO;

  expect(user.email).toBe(registerUser.email);
  expect(accessToken).toBeTruthy();
  expect(refreshToken).toBeTruthy();

  return body;
};

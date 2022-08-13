import { User } from '@prisma/client';
import { LoginUserDTO } from '../../../src/authentication/dto/login-user.dto';
import { RegisterUserDTO } from '../../../src/authentication/dto/register-user.dto';
import bcrypt from 'bcrypt';
import { HttpStatus } from '@nestjs/common';
import { LoginResponseDTO } from '../../../src/authentication/dto/login-response.dto';
import { AuthenticationController } from '../../../src/authentication/authentication.controller';
import { request } from '../setup';

const authRoute = AuthenticationController.AUTH_API_ROUTE;
const registerRoute = authRoute + AuthenticationController.REGISTER_API_ROUTE;

export const testUser: RegisterUserDTO = {
  username: 'test_user',
  email: 'test_user@test.com',
  password: 'test',
};

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

export const registerUser = async (
  dto: RegisterUserDTO
): Promise<LoginResponseDTO> => {
  const registerUser = await createUser(dto);

  const { body } = await request
    .post(registerRoute)
    .send(dto)
    .expect(HttpStatus.CREATED);

  const { user, tokens } = body as LoginResponseDTO;
  const { accessToken, refreshToken } = tokens;

  expect(user.email).toBe(registerUser.email);
  expect(accessToken).toBeTruthy();
  expect(refreshToken).toBeTruthy();

  return body;
};

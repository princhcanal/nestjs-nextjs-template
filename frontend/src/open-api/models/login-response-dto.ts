/* tslint:disable */
/* eslint-disable */
/**
 * NestJS/NextJS Template
 * API for NestJS/NextJS Template
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { UserDTO } from './user-dto';

/**
 *
 * @export
 * @interface LoginResponseDTO
 */
export interface LoginResponseDTO {
  /**
   *
   * @type {UserDTO}
   * @memberof LoginResponseDTO
   */
  user: UserDTO;
  /**
   *
   * @type {string}
   * @memberof LoginResponseDTO
   */
  accessToken: string;
  /**
   *
   * @type {string}
   * @memberof LoginResponseDTO
   */
  refreshToken: string;
}
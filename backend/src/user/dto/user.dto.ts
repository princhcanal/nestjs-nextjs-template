export class UserDTO {
  public constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    email: string,
    username: string
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.email = email;
    this.username = username;
  }

  public id: string;

  public createdAt: Date;

  public updatedAt: Date;

  public email: string;

  public username: string;
}

export interface UserInterface {
  username: string;
  password: string;
  email: string;
  isVerified?: boolean;
  refreshToken?: string;
  imageLink?: string;
}

export class User {
  username: string;

  password: string;

  email: string;

  isVerified?: boolean;

  refreshToken?: string;

  imageLink?: string;

  constructor(userDto: UserInterface) {
    this.username = userDto.username;
    this.password = userDto.password;
    this.email = userDto.email;
    this.imageLink = userDto.imageLink;
  }
}

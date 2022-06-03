import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { maxPasswordLength, minPasswordLength } from '../users.schema';

export default class UserCredsDTO {
  @IsEmail({}, { message: 'email must be valid' })
  email: string;

  @MinLength(minPasswordLength)
  @MaxLength(maxPasswordLength)
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

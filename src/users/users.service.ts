import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './users.schema';
import UserCredsDTO from './dto/userCreds.dto';
import { checkPassword, hashPassword } from 'src/utils/handlePassword';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signup(userCreds: UserCredsDTO) {
    const { email, password } = userCreds;
    const toBeCheckedUser = await this.userModel.findOne({ email });
    if (toBeCheckedUser) throw new ConflictException('User Already Exists');

    const newUser = new this.userModel({
      email,
      password: await hashPassword(password),
    });

    await newUser.save();
    // TODO send Email with token
    return 'Check Your Email For verification';
  }

  async loginUser(userCreds: UserCredsDTO) {
    const { email, password } = userCreds;
    const toBeCheckedUser = await this.userModel.findOne({ email });

    if (!toBeCheckedUser || !checkPassword(toBeCheckedUser.password, password))
      throw new BadRequestException('Invalid Credentials');

    if (!toBeCheckedUser.isVerified)
      throw new BadRequestException('Please Verify Your Email First');

    // TODO generate JWT Token
    return 'Token';
  }

  async verifyCode(userId: string, token: string) {
    const toBeCheckedUser = await this.userModel.findOne({ id: userId });

    if (!toBeCheckedUser) throw new NotFoundException('User Not Found');

    if (toBeCheckedUser.verifyToken !== token)
      throw new BadRequestException('Invalid Token');

    toBeCheckedUser.isVerified = true;
    await toBeCheckedUser.save();
    return 'Your email has been verified successfully';
  }
}

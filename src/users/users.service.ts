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

import { AlertType } from 'src/alert/alert.inteface';
import { AlertService } from 'src/alert/alert.service';
import { getVerifyEmailTemplate } from 'src/alert/alert.utils';

import { checkPassword, hashPassword } from 'src/utils/handlePassword';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private alertService: AlertService,
  ) {
    this.alertService.setProvider(AlertType.Email);
  }

  async sendEmailVerification(id: string, email: string, token: string) {
    await this.alertService.sendAlert({
      to: email,
      from: `Uptime URL Monitor <${process.env.SENDER_EMAIL}>`,
      subject: 'Verify Your Email',
      content: getVerifyEmailTemplate(
        `${process.env.BASE_URL}/api/users/verify/${id}?token=${token}`,
      ),
    });
  }

  async signup(userCreds: UserCredsDTO) {
    const { email, password } = userCreds;
    const toBeCheckedUser = await this.userModel.findOne({ email });
    if (toBeCheckedUser) {
      if (toBeCheckedUser.isVerified)
        throw new ConflictException('User Already Exists');
      else {
        await this.sendEmailVerification(
          toBeCheckedUser.id,
          email,
          toBeCheckedUser.verifyToken,
        );

        throw new ConflictException(
          'User Already Exists, Please Verify Your Email',
        );
      }
    }

    const newUser = new this.userModel({
      email,
      password: await hashPassword(password),
    });

    await newUser.save();
    await this.sendEmailVerification(newUser.id, email, newUser.verifyToken);

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

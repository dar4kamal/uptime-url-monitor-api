import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from 'src/users/users.schema';
import { JwtPayloadDTO } from '../users/dto/jwt.payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayloadDTO): Promise<User> {
    const { userId } = payload;
    const user = await this.userModel.findOne({ id: userId });

    if (!user)
      throw new UnauthorizedException('Unauthorized access,Invalid Token');
    return user;
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/auth/types/jwt.type';
import { UserService } from 'src/user/user.service';
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET') || 'defaultSecret', // Use your environment variable for the secret
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.headers.authorization.replace('Bearer', '').trim();
    const userDocument = await this.userService.findOne({
      email: payload.email,
    });
    if (!userDocument.refreshToken) {
      throw new UnauthorizedException('Login Again');
    }
    const user = await this.userService.mapToUserResponse(userDocument);
    if (!user) {
      throw new UnauthorizedException('Invalid Token');
    }

    return { ...user, refreshToken };
  }
}

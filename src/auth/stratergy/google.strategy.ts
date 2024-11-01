import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { RegistrationMethod } from 'src/enums/users/registration-method.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/google-redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    const { emails } = profile; // Access the emails from the profile

    const email = emails?.[0]?.value;
    if (!email) {
      return done(new UnauthorizedException('No email found'), null);
    }

    // Check if the user already exists
    let userDocument = await this.userService.findOne({ email });

    if (!userDocument) {
      // Create a new user if they don't exist
      userDocument = await this.userService.create_o_auth({
        email,
        registrationMethod: RegistrationMethod.GOOGLE,
      });
    } else if (userDocument.registrationMethod !== RegistrationMethod.GOOGLE) {
      // Handle the case where the user is registered with a different method
      return done(
        new UnauthorizedException('User registered with a different method'),
        null,
      );
    }

    // Map the user response
    const userResponse = await this.userService.mapToUserResponse(userDocument);

    // Call done with the user response
    done(null, userResponse);
  }
}

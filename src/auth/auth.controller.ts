import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request) {
    // Access the user from the request object
    return this.authService.login(request.user); // Pass the user to AuthService for JWT generation
  }

  //for oauth call the same login service but use different guard and enpoint, making sure the reques.user object is consistent among all

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  async refresh(@Request() request) {
    return this.authService.refresh(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Request() request) {
    return this.authService.logout(request.user);
  }
}

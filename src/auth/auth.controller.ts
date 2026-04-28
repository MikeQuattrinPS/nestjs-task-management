import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './DTO/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}
	@Post('/signup')
	signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
		return this.authService.createUser(authCredentialsDto);
	}

	@Post('/signin')
	signIn(
		@Body() authCredentialsDto: AuthCredentialsDto,
	): Promise<{ token: string }> {
		return this.authService.signIn(authCredentialsDto);
	}

	@Post('/test')
	@UseGuards(AuthGuard())
	test(@Req() req): string {
		return `Hello ${req.user.username}`;
	}
}

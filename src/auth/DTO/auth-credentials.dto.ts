import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
	@IsString()
	@MinLength(4)
	@MaxLength(32)
	username: string;

	@IsString()
	@MinLength(4)
	@MaxLength(32)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			'Password must contain at least 1 upper case letter, 1 lower case letter, and at least 1 number or special character',
	})
	password: string;
}

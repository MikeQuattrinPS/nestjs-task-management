import {
	InternalServerErrorException,
	ConflictException,
	UnauthorizedException,
	Injectable,
} from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './DTO/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
		const { username, password } = authCredentialsDto;
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = this.usersRepository.create({
			username,
			password: hashedPassword,
		});
		try {
			await this.usersRepository.save(user);
		} catch (error) {
			if ((error as any).code === '23505') {
				throw new ConflictException('This username already exists');
			}
			throw new InternalServerErrorException();
		}
	}

	async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
		const { username, password } = authCredentialsDto;
		const user = await this.usersRepository.findOne({ where: { username } });

		if (user && (await bcrypt.compare(password, user.password))) {
			// Generate and return a JWT or any other token here
			return 'token';
		} else {
			throw new UnauthorizedException('Invalid credentials');
		}
	}
}

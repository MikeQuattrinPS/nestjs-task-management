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
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		private jwtService: JwtService,
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

	async signIn(
		authCredentialsDto: AuthCredentialsDto,
	): Promise<{ token: string }> {
		const { username, password } = authCredentialsDto;
		const user = await this.usersRepository.findOne({ where: { username } });

		if (user && (await bcrypt.compare(password, user.password))) {
			const payload: JwtPayload = { username };
			const token = await this.jwtService.sign(payload);
			return { token };
		} else {
			throw new UnauthorizedException('Invalid credentials');
		}
	}
}

import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './DTO/auth-credentials.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
		const { username, password } = authCredentialsDto;
		const user = this.usersRepository.create({ username, password });
		try {
			await this.usersRepository.save(user);
		} catch (error) {
			console.log(error);
			if ((error as any).code === '23505') {
				throw new Error('This username already exists');
			}
			throw error;
		}
	}
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './DTO/create-task.dto';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(Task)
		private tasksRepository: Repository<Task>,
	) {}

	async getTaskById(id: string): Promise<Task> {
		const found = await this.tasksRepository.findOne({ where: { id } });
		if (!found) {
			throw new NotFoundException(`Task with ID "${id}" not found`);
		}
		return found;
	}

	async getAllTasks(): Promise<Task[]> {
		return this.tasksRepository.find();
	}

	async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
		const { title, description } = createTaskDto;
		const task = this.tasksRepository.create({
			title,
			description,
			status: TaskStatus.OPEN,
		});

		await this.tasksRepository.save(task);
		return task;
	}

	async deleteTask(id: string): Promise<void> {
		const found = await this.getTaskById(id);
		await this.tasksRepository.delete(found.id);
	}

	async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
		const task = await this.getTaskById(id);
		task.status = status;
		await this.tasksRepository.save(task);
		return task;
	}

	async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
		const { status, search } = filterDto;

		let tasks = await this.getAllTasks();

		if (status) {
			tasks = tasks.filter((task) => task.status === status);
		}

		if (search) {
			tasks = tasks.filter((task) => {
				if (task.title.includes(search) || task.description.includes(search)) {
					return true;
				}
				return false;
			});
		}

		return tasks;
	}
}

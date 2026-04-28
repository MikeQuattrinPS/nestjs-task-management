import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Patch,
	Query,
	UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './DTO/create-task.dto';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './DTO/update-task-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
	constructor(private tasksService: TasksService) {}

	@Get()
	async getAllTasks(
		@Query() filterDto: GetTasksFilterDto,
		@GetUser() user: User,
	): Promise<Task[]> {
		if (Object.keys(filterDto).length) {
			return this.tasksService.getTasksWithFilters(filterDto, user);
		} else {
			return this.tasksService.getAllTasks(user);
		}
	}

	@Get('/:id')
	getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
		return this.tasksService.getTaskById(id, user);
	}

	@Post()
	createTask(
		@Body() createTaskDto: CreateTaskDto,
		@GetUser() user: User,
	): Promise<Task> {
		return this.tasksService.createTask(createTaskDto, user);
	}

	@Delete('/:id')
	deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
		return this.tasksService.deleteTask(id, user);
	}

	@Patch('/:id/status')
	updateTaskStatus(
		@Param('id') id: string,
		@Body() updateTaskStatusDto: UpdateTaskStatusDto,
		@GetUser() user: User,
	): Promise<Task> {
		const { status } = updateTaskStatusDto;
		return this.tasksService.updateTaskStatus(id, status, user);
	}
}

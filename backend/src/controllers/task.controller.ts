import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger'
import { ProjectGet } from 'src/dto/project.dto'
import { UserGet } from 'src/dto/user.dto'
import { DeleteResult } from 'typeorm'

import { TaskGet, TaskPost } from '../dto/task.dto'
import { TaskService } from '../services/task.service'

@Controller('api')
export class TaskController {
	constructor(private readonly service: TaskService) {}

	@Get('all_entities')
	@ApiOperation({
		operationId: 'get_task_list',
	})
	public async get_all_entities(): Promise<{
		tasks: TaskGet[]
		projects: ProjectGet[]
		users: UserGet[]
	}> {
		return this.service.get_all_entities()
	}

	@Get('tasks')
	@ApiOperation({
		operationId: 'get_task_list',
	})
	public async get_task_list(): Promise<TaskGet[]> {
		return this.service.get_task_list()
	}

	@Post('tasks')
	@ApiBody({
		type: () => TaskPost,
	})
	@ApiOperation({
		operationId: 'post_task',
	})
	public async post_task(@Body() payload: TaskPost): Promise<TaskGet> {
		return this.service.post_task(payload)
	}

	@Delete('tasks/:id')
	@ApiOperation({
		operationId: 'delete_task',
	})
	@ApiParam({
		name: 'id',
		type: 'string',
		required: true,
	})
	async delete_task(@Param('id') id: string): Promise<DeleteResult> {
		return this.service.delete_task(id)
	}
}

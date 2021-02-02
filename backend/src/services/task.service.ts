import { Inject, Injectable } from '@nestjs/common'
import { User } from 'src/db/user.schema'
import { ProjectGet } from 'src/dto/project.dto'
import { UserGet } from 'src/dto/user.dto'
import { DeleteResult, Repository } from 'typeorm'

import { PROJECT_REPO, TASK_REPO, USER_REPO } from '../db/database.module'
import { Project } from '../db/project.schema'
import { Task } from '../db/task.schema'
import { TaskGet, TaskPost } from '../dto/task.dto'

@Injectable()
export class TaskService {
	constructor(
		@Inject(TASK_REPO) private _task: Repository<Task>,
		@Inject(PROJECT_REPO) private _project: Repository<Project>,
		@Inject(USER_REPO) private _user: Repository<User>,
	) {}

	public async get_project_list(): Promise<ProjectGet[]> {
		return this._project.createQueryBuilder('project').getMany()
	}

	public async get_user_list(): Promise<UserGet[]> {
		return this._user.createQueryBuilder('user').getMany()
	}

	public async get_task_list(): Promise<TaskGet[]> {
		return this._task
			.createQueryBuilder('task')
			.leftJoinAndSelect('task.project', 'project')
			.leftJoinAndSelect('task.createdBy', 'createdBy')
			.leftJoinAndSelect('task.assignee', 'assignee')
			.getMany()
	}

	public async get_all_entities(): Promise<any> {
		const tasks = await this.get_task_list()
		const users = await this.get_user_list()
		const projects = await this.get_project_list()

		return Promise.resolve({ tasks, users, projects })
	}

	public async post_task(payload: TaskPost): Promise<TaskGet> {
		const { project, createdBy, assignee } = payload

		if (!project?.id) {
			const created = await this._project.save(project)
			payload.project = created
		}

		if (!createdBy?.id) {
			const created = await this._user.save(createdBy)
			payload.createdBy = created
		}

		if (!assignee) {
			payload.assignee = null
		} else if (!assignee?.id) {
			const created = await this._user.save(assignee)
			payload.assignee = created
		}

		const created = {
			...payload,
			createdAt: new Date().toUTCString(),
		}

		return await this._task.save(created)
	}

	public async delete_task(id: string): Promise<DeleteResult> {
		return this._task
			.createQueryBuilder()
			.delete()
			.from(Task)
			.where('id = :id', { id })
			.execute()
	}
}

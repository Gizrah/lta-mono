import { OmitType } from '@nestjs/swagger'

import { ProjectGet } from './project.dto'
import { UserGet } from './user.dto'

export class TaskGet {
	id: string
	name: string
	description: string
	createdAt: string
	priority: string
	state: string
	estimate: number

	createdBy: UserGet
	assignee: UserGet
	project: ProjectGet
}

export class TaskPost extends OmitType(TaskGet, [
	'id',
	'createdBy',
	'createdAt',
	'assignee',
	'project',
] as const) {
	project: {
		id?: string
		name: string
	}
	createdBy: {
		id?: string
		name: string
	}
	assignee?: {
		id?: string
		name: string
	}
}

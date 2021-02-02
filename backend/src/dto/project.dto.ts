import { TaskGet } from './task.dto'

export class ProjectGet {
	id: string
	name: string
}

export class ProjectList extends ProjectGet {
	tasks: TaskGet[]
}

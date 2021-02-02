import { TaskGet } from './task.dto'

export class UserGet {
	id: string
	name: string
}

export class UserDetails extends UserGet {
	assigned: TaskGet[]
	created: TaskGet[]
}

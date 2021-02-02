import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Task } from './task.schema'

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	name: string

	@OneToMany(() => Task, (task) => task.assignee)
	assigned: Task[]

	@OneToMany(() => Task, (task) => task.createdBy)
	created: Task[]
}

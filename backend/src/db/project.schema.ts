import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Task } from './task.schema'

@Entity()
export class Project {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	name: string

	@OneToMany(() => Task, (task) => task.project)
	tasks: Task[]
}

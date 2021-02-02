import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Project } from './project.schema'
import { User } from './user.schema'

@Entity()
export class Task {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	name: string

	@Column()
	description: string

	@ManyToOne(() => User, (user) => user.created)
	createdBy: User

	@Column({ type: 'date', nullable: true })
	createdAt: string

	@ManyToOne(() => User, (user) => user.assigned, { nullable: true })
	assignee: User

	@Column({ enum: ['none', 'low', 'high'], default: 'none' })
	priority: string

	@Column({ enum: ['backlog', 'scheduled', 'done'] })
	state: string

	@Column()
	estimate: number

	@ManyToOne((type) => Project, (field) => field.tasks)
	project: Project
}

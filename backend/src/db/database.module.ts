import { Module } from '@nestjs/common'
import { Connection, createConnection } from 'typeorm'

import { Project } from './project.schema'
import { Task } from './task.schema'
import { User } from './user.schema'

export const DATABASE_PROVIDER = 'DATABASE_PROVIDER'
export const TASK_REPO = 'TASK_REPO'
export const PROJECT_REPO = 'PROJECT_REPO'
export const USER_REPO = 'USER_REPO'

const databaseProviders = [
	{
		provide: DATABASE_PROVIDER,
		useFactory: async () =>
			await createConnection({
				type: 'postgres',
				host: '0.0.0.0',
				port: 25433,
				username: 'postgres',
				password: 'password',
				database: '__lta__',
				entities: [Task, Project, User],
				synchronize: true,
			}),
	},
	{
		provide: TASK_REPO,
		useFactory: (connection: Connection) => connection.getRepository(Task),
		inject: [DATABASE_PROVIDER],
	},
	{
		provide: PROJECT_REPO,
		useFactory: (connection: Connection) => connection.getRepository(Project),
		inject: [DATABASE_PROVIDER],
	},
	{
		provide: USER_REPO,
		useFactory: (connection: Connection) => connection.getRepository(User),
		inject: [DATABASE_PROVIDER],
	},
]

@Module({
	providers: databaseProviders,
	exports: [...databaseProviders, DATABASE_PROVIDER, TASK_REPO, PROJECT_REPO, USER_REPO],
})
export class DatabaseModule {}

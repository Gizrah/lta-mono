import { Module } from '@nestjs/common'
import { TaskController } from './controllers/task.controller'
import { TaskService } from './services/task.service'
import { DatabaseModule } from './db/database.module'

@Module({
	imports: [DatabaseModule],
	controllers: [TaskController],
	providers: [TaskService],
})
export class AppModule {}

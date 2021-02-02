import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { TranslateModule } from '@ngx-translate/core'

import { AddTaskModal } from './add-task/add-task.modal'
import { ListTaskComponent } from './list-task/list-task.component'
import { TaskListPage } from './task-list/task-list.page'
import { ViewTaskModal } from './view-task/view-task.modal'

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		TranslateModule,
		ReactiveFormsModule,
		FormsModule,
	],
	declarations: [TaskListPage, ViewTaskModal, ListTaskComponent, AddTaskModal],
	exports: [TaskListPage, ViewTaskModal, ListTaskComponent, AddTaskModal],
})
export class TaskPageModule {}

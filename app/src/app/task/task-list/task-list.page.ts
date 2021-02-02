import { Component } from '@angular/core'
import { IonRouterOutlet, ModalController } from '@ionic/angular'
import { Observable } from 'rxjs'

import { Project, Task, TasksService } from '../../services/tasks.service'
import { AddTaskModal } from '../add-task/add-task.modal'

@Component({
	selector: 'app-task-list',
	templateUrl: 'task-list.page.html',
	styleUrls: ['task-list.page.scss'],
})
export class TaskListPage {
	public tasks$: Observable<Task[]>
	public projects$: Observable<Project[]>

	private _project: string

	constructor(
		private tasks: TasksService,
		private modal: ModalController,
		private outlet: IonRouterOutlet,
	) {}

	get project(): string {
		return this._project
	}

	set project(p: string) {
		this._project = p
		this.setProject(p)
	}

	public ngOnInit(): void {
		this.projects$ = this.tasks.projects$
		this.tasks$ = this.tasks.tasks$

		this.tasks.getTasks().subscribe()
	}

	public refresh(ev): void {
		this.tasks.refreshTasks().subscribe(() => ev.target.complete())
	}

	public setProject(project: string): void {
		this.tasks.filterTasks(project)
	}

	public async addTask(): Promise<void> {
		const modal = await this.modal.create({
			component: AddTaskModal,
			swipeToClose: false,
			presentingElement: this.outlet.nativeEl,
		})

		await modal.present()
		await modal.onWillDismiss()
	}
}

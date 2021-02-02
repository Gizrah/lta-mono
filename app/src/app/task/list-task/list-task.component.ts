import { Component, Input } from '@angular/core'
import { IonRouterOutlet, ModalController, Platform } from '@ionic/angular'

import { Task, TasksService } from '../../services/tasks.service'
import { ViewTaskModal } from '../view-task/view-task.modal'

@Component({
	selector: 'app-list-task',
	templateUrl: './list-task.component.html',
	styleUrls: ['./list-task.component.scss'],
})
export class ListTaskComponent {
	@Input() public task: Task

	constructor(
		private outlet: IonRouterOutlet,
		private modal: ModalController,
		private platform: Platform,
		private tasks: TasksService,
	) {}

	public isIos(): boolean {
		const win = window as any
		return win?.Ionic?.mode === 'ios'
	}

	public async showTask(task: Task): Promise<void> {
		if (this.platform.is('mobile')) {
			const modal = await this.modal.create({
				component: ViewTaskModal,
				swipeToClose: true,
				presentingElement: this.outlet.nativeEl,
				componentProps: {
					task,
				},
			})

			await modal.present()
		} else {
			this.tasks.setTask(task)
		}
	}
}

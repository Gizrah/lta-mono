import { Component, Input } from '@angular/core'
import { ModalController } from '@ionic/angular'

import { Task, TasksService } from '../../services/tasks.service'

@Component({
	selector: 'app-view-task',
	templateUrl: './view-task.modal.html',
	styleUrls: ['./view-task.modal.scss'],
})
export class ViewTaskModal {
	@Input() public task: Task
	@Input() public mobile: boolean = true

	constructor(private modal: ModalController, private tasks: TasksService) {}

	public yeet(): void {
		this.tasks.deleteTask(this.task.id).subscribe(
			(result) => {
				this.dismiss({ done: true })
			},
			(error) => this.modal.dismiss(),
		)
	}

	public async dismiss(pl?: any): Promise<void> {
		if (this.mobile) {
			this.modal.dismiss(pl)
		} else {
			this.tasks.setTask(this.task)
		}
	}
}

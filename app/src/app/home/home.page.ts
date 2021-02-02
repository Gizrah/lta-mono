import { Component, HostBinding } from '@angular/core'
import { Platform } from '@ionic/angular'
import { Observable } from 'rxjs'

import { dolog } from '../common'
import { Project, Task, TasksService } from '../services/tasks.service'

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage {
	public mobile: boolean = false
	public task$: Observable<Task>

	public tasks$: Observable<Task[]>
	public projects$: Observable<Project[]>

	constructor(private tasks: TasksService, private platform: Platform) {}

	public ngOnInit(): void {
		this.task$ = this.tasks.task$

		this.mobile = this.platform.is('mobile')
		this.platform.resize.subscribe((resize) => {
			this.mobile = this.platform.is('mobile')
			dolog('info', 'Mobile:', null, this.platform.is('mobile'))
		})
	}

	@HostBinding('class.lta-desktop')
	get __componentClass(): boolean {
		return !this.mobile
	}
}

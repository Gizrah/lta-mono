import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ModalController } from '@ionic/angular'
import { Observable, Subject } from 'rxjs'
import { filter, takeUntil } from 'rxjs/operators'
import { hasValue } from 'src/app/common'

import { Project, TasksService, User } from '../../services/tasks.service'

@Component({
	selector: 'app-add-task',
	templateUrl: './add-task.modal.html',
	styleUrls: ['./add-task.modal.scss'],
})
export class AddTaskModal {
	public active: boolean = false
	public group: FormGroup

	public users$: Observable<User[]>
	public projects$: Observable<Project[]>

	private _task: Record<string, any> = {
		name: null,
		description: null,
		priority: 'none',
		state: 'backlog',
		estimate: 0,
		project: {
			id: null,
			name: null,
		},
		createdBy: {
			id: null,
			name: null,
		},
		assignee: {
			id: null,
			name: null,
		},
	}

	private destroy$: Subject<void> = new Subject()

	constructor(
		private modal: ModalController,
		private tasks: TasksService,
		private builder: FormBuilder,
	) {
		this.projects$ = this.tasks.projects$
		this.users$ = this.tasks.users$

		this.createForm()
	}

	public ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}

	private createForm(): void {
		this.group = this.builder.group({
			createdBy: this.builder.group({
				id: this._task.createdBy.id,
				name: [this._task.createdBy.name, Validators.required],
				selected: this.builder.group({
					id: '',
					name: '',
				}),
			}),
			project: this.builder.group({
				id: this._task.project.id,
				name: [this._task.project.name, Validators.required],
				selected: this.builder.group({
					id: '',
					name: '',
				}),
			}),
			assignee: this.builder.group({
				id: this._task.assignee.id,
				name: this._task.assignee.name,
				selected: this.builder.group({
					id: '',
					name: '',
				}),
			}),
			name: [this._task.name, Validators.required],
			description: [this._task.description, Validators.required],
			priority: this._task.priority,
			state: this._task.state,
			estimate: this._task.estimate,
		})

		this.valueChangesFor('createdBy')
		this.valueChangesFor('project')
		this.valueChangesFor('assignee')
	}

	private valueChangesFor(control: string): void {
		const selectorCtrl = this.group.get(control) as FormGroup
		const nameCtrl = selectorCtrl.get('name')
		const selectedCtrl = selectorCtrl.get('selected')
		const source = control === 'project' ? 'getProject' : 'getUser'

		selectorCtrl.valueChanges
			.pipe(
				filter((a) => !!a),
				takeUntil(this.destroy$),
			)
			.subscribe((values) => {
				const { selected } = values ?? {}
				const { id } = selected ?? {}

				if (hasValue(id)) {
					const selname = selected.name
					if (!selname) {
						const content = this.tasks[source](id)

						selectedCtrl
							.get('name')
							.patchValue(content?.name ?? '', { emitEvent: false })
						nameCtrl.patchValue(content?.name ?? '', { emitEvent: false })

						if (nameCtrl.enabled) nameCtrl.disable({ emitEvent: false })
					}
				} else {
					if (nameCtrl.disabled) nameCtrl.enable({ emitEvent: false })
					if (selectedCtrl.dirty) {
						selectedCtrl.reset(undefined, { emitEvent: false })
						nameCtrl.reset(undefined, { emitEvent: false })
					}
				}
			})
	}

	public save(): void {
		if (!this.group.valid) return
		this.active = true

		const payload = this.group.value

		const upsert = (ctrl: string) => {
			const control = this.group.get(ctrl)
			const nameCtrl = control.get('name')
			const selectedCtrl = control.get('selected')

			if (nameCtrl.disabled) {
				const { value } = selectedCtrl
				payload[ctrl] = value
			} else {
				if (nameCtrl.valid) {
					if (!hasValue(nameCtrl.value)) payload[ctrl] = null
					else {
						payload[ctrl] = {
							name: nameCtrl.value,
						}
					}
				}
			}
		}

		const nested = ['createdBy', 'project', 'assignee']
		nested.forEach((item) => upsert(item))

		this._task = payload

		this.tasks.addTask(payload).subscribe(
			(result) => {
				this.active = false
				this.dismiss(payload)
			},
			(err) => {
				// Worst error handling EU
				this.active = false
				console.log(err)
			},
		)
	}

	public dismiss(pl?: any): void {
		this.modal.dismiss(pl)
	}
}

import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of, throwError } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'

import { dolog, ExMap, hasValue } from '../common'

export interface IdName {
	id: string
	name: string
}

export interface Project extends IdName {}
export interface User extends IdName {}
export interface Task {
	id: string
	name: string
	description: string
	createdAt: string
	priority: 'none' | 'low' | 'high'
	state: 'backlog' | 'scheduled' | 'done'
	estimate: number
	project: IdName
	createdBy: IdName
	assignee: IdName

	icons: {
		state?: string
		priority?: string
	}

	completed: boolean
}

export interface AllEntities {
	tasks: Task[]
	projects: Project[]
	users: User[]
}

@Injectable({
	providedIn: 'root',
})
export class TasksService {
	public task$: BehaviorSubject<Task> = new BehaviorSubject(null)

	public tasks$: BehaviorSubject<Task[]> = new BehaviorSubject([])
	public projects$: BehaviorSubject<Project[]> = new BehaviorSubject([])
	public users$: BehaviorSubject<User[]> = new BehaviorSubject([])

	private _task: Task

	private _tasks: ExMap<string, Task> = new ExMap()
	private _projects: ExMap<string, Project> = new ExMap()
	private _users: ExMap<string, User> = new ExMap()

	private _updated: number

	// private _url: string = 'https://tidy-list.firebaseio.com/tidy-list.json'
	private _url: string = 'http://localhost:8101/api/'

	constructor(private http: HttpClient) {}

	get url(): string {
		return this._url
	}

	/**
	 * @summary
	 * Fetch a new list of Tasks, Projects and Users
	 */
	public getTasks(): Observable<Task[]> {
		return this.fetchEntities()
	}

	/**
	 * @summary
	 * Fetch a list of all available entities from the backend, map the tasks
	 * so they include some icons. Convert all arrays to ExMap maps and store
	 * those locally, then update the observables with the new data.
	 *
	 * @returns Observable HTTP call with mapped Task array
	 */
	private fetchEntities(): Observable<Task[]> {
		return this.http.get(this._url + 'all_entities/').pipe(
			catchError((error) => {
				dolog('error', 'HTTP ERROR', error)

				return of([])
			}),
			map((result: AllEntities) => {
				const { tasks, users, projects } = result
				const taskmap: ExMap<string, Task> = new ExMap()

				const mapped = tasks.map((content) => {
					const task: Task = content
					const { id } = task
					task.icons = {}

					if (task.state === 'done') task.completed = true
					switch (task.state) {
						case 'backlog': {
							task.icons.state = 'list-circle-outline'
							break
						}
						case 'scheduled': {
							task.icons.state = 'calendar-outline'
							break
						}
						case 'done': {
							task.icons.state = 'checkmark-done-circle-outline'
							break
						}
						default: {
							task.icons.state = 'help-circle-outline'
							break
						}
					}

					switch (task.priority) {
						case 'high': {
							task.icons.priority = 'arrow-up-circle-outline'
							break
						}
						case 'low': {
							task.icons.priority = 'arrow-down-circle-outline'
							break
						}
						default: {
							task.icons.priority = null
							break
						}
					}

					taskmap.set(id, task)
					return task
				})

				this._updated = new Date().valueOf()

				this._tasks = taskmap
				this._users = new ExMap(users, 'id')
				this._projects = new ExMap(projects, 'id')

				this.tasks$.next(taskmap.toArray())
				this.projects$.next(projects)
				this.users$.next(users)

				return mapped
			}),
		)
	}

	/**
	 * @summary
	 * Refresh the tasks list. Throttles the calls to once every 3 seconds at
	 * max.
	 */
	public refreshTasks(): Observable<Task[]> {
		const dtnow = new Date().valueOf()
		const diff = dtnow - (this._updated ?? dtnow)
		if (diff < 3000) return

		return this.fetchEntities()
	}

	/**
	 * @summary
	 * Filter the list of tasks based on a certain project.
	 *
	 * @param project project id
	 *
	 * @returns Observable with filtered Task array
	 */
	public filterTasks(project: string): void {
		if (!hasValue(project)) return

		const filtered: Task[] = this._tasks
			.filter((task) => {
				if (task.project.id === project) return true
				return false
			})
			.toArray()

		this.tasks$.next(filtered)
	}

	/**
	 * @summary
	 * When on desktop, set the observable Task stream, so the modal won't be
	 * called and instead the task will be shown. Empties the current Task if
	 * the ids match.
	 *
	 * @param task Task to select
	 */
	public setTask(task: Task): void {
		if (!task) return
		if (task.id === this._task?.id) return this.task$.next(null)
		else {
			this._task = task
			this.task$.next(task)
		}
	}

	/**
	 * @summary
	 * POST new task
	 *
	 * @param task Task-like payload
	 *
	 * @returns Observable HTTP call
	 */
	public addTask(task: Task): Observable<any> {
		if (!hasValue(task)) return throwError('No!')
		return this.http.post(this._url + 'tasks', task).pipe(tap(() => this.getTasks()))
	}

	/**
	 * @summary
	 * Task-be-gone
	 *
	 * @param id task id to remove
	 *
	 * @returns Observable HTTP call
	 */
	public deleteTask(id: string): Observable<any> {
		if (!id) return throwError('No.')
		return this.http.delete(this._url + 'tasks/' + id).pipe(tap(() => this.getTasks()))
	}

	/**
	 * @summary
	 * Find and return the user for the given id value from the local map
	 *
	 * @param id uuid string
	 *
	 * @returns User object
	 */
	public getUser(id: string): User {
		return this._users.get(id)
	}

	/**
	 * @summary
	 * Find and return the project for the given id value from the local map
	 *
	 * @param id uuid string
	 *
	 * @returns Project object
	 */
	public getProject(id: string): Project {
		return this._projects.get(id)
	}
}

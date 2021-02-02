import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing'

import { Task, TasksService } from './tasks.service'
import { all_entities } from './tasks.service.mock'

describe('TasksService', () => {
	let httpMock: HttpTestingController
	let service: TasksService
	let tasks: Task[]

	const getData = () => {
		service.getTasks().subscribe((res) => {
			expect(res).toEqual(all_entities.tasks as any)
			tasks = res
		})

		const request = httpMock.expectOne(service.url + 'all_entities/')
		expect(request.request.method).toEqual('GET')

		request.flush(all_entities)
	}

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
		})

		httpMock = TestBed.inject(HttpTestingController)
		service = TestBed.inject(TasksService)
	}))

	jest.setTimeout(12000)

	it('should be created', () => {
		expect(service).toBeTruthy()
	})

	it('should get all tasks', fakeAsync(() => {
		getData()
		tick()

		expect(tasks).toEqual(all_entities.tasks as any)
	}))

	it('should NOT refresh tasks immediately', fakeAsync(() => {
		getData()
		tick()

		const notsub = service.refreshTasks()
		expect(notsub).toBeUndefined()
	}))

	test('should refresh tasks after waiting', fakeAsync(() => {
		getData()
		tick()

		let hassub = service.refreshTasks()
		expect(hassub).toBeUndefined()

		tick(3200)

		hassub = service.refreshTasks()
		expect(hassub).not.toBeUndefined()
	}))

	it('should filter tasks based on a project id', fakeAsync(() => {
		getData()
		tick()

		const projectId = tasks[0].project.id
		service.filterTasks(projectId)

		tick()

		service.tasks$.subscribe((res) => {
			expect(res.length).toEqual(2)
		})
	}))

	it('should not have a task in the selected task$ stream', fakeAsync(() => {
		getData()
		tick()

		service.task$.subscribe((current) => {
			expect(current).toEqual(null)
		})
	}))

	it('should update the selected task$ stream', fakeAsync(() => {
		getData()
		tick()

		const task = tasks[2]
		service.setTask(task)

		tick()

		service.task$.subscribe((current) => {
			expect(current).toEqual(task)
		})
	}))

	it('should empty the task$ stream because the given task is the same', fakeAsync(() => {
		getData()
		tick()

		const task = tasks[2]
		service.setTask(task)
		tick()
		service.setTask(task)
		tick()

		service.task$.subscribe((current) => {
			expect(current).toEqual(null)
		})

		tick()
	}))

	it('should fail to POST a new task', fakeAsync(() => {
		service.addTask(null).subscribe(
			() => {},
			(error) => {
				expect(error).toEqual('No!')
			},
		)
	}))

	it('should succeed to POST a new task', fakeAsync(() => {
		const payload = {
			name: 'UnitTest',
			description: 'UnitTest Task',
			createdBy: { id: 'dccc6f26-1815-4d88-bab1-2bf5f7d9007e', name: 'Nieuwe Gebruiker' },
			project: { id: '6d711647-d28f-4987-aca4-673e60f3a973', name: 'Test Project' },
			priority: 'none',
			state: 'done',
			estimate: 15,
		}

		service.addTask(payload as Task).subscribe((res) => {
			expect(res).toEqual(payload)
		})

		const request = httpMock.expectOne(service.url + 'tasks')
		expect(request.request.method).toEqual('POST')

		request.flush(payload)
		tick()
	}))

	it('should fail to DELETE a task', fakeAsync(() => {
		service.deleteTask(null).subscribe(
			() => {},
			(error) => {
				expect(error).toEqual('No.')
			},
		)
	}))

	it('should succeed to DELETE a task', fakeAsync(() => {
		const id = '4db0c7ef-a8a4-44db-ba94-2b371badf6c3'
		const raw = {
			raw: [],
			affected: 1,
		}

		service.deleteTask(id).subscribe((res) => {
			expect(res).toEqual(raw)
		})

		const request = httpMock.expectOne(service.url + 'tasks/' + id)
		expect(request.request.method).toEqual('DELETE')

		request.flush(raw)
		tick()
	}))

	it('should get a user with the given id', fakeAsync(() => {
		getData()
		tick()

		const id = 'dccc6f26-1815-4d88-bab1-2bf5f7d9007e'
		const user = service.getUser(id)

		expect(user.name).toEqual('Nieuwe Gebruiker')
	}))

	it('should get a project with the given id', fakeAsync(() => {
		getData()
		tick()

		const id = '6d711647-d28f-4987-aca4-673e60f3a973'
		const project = service.getProject(id)

		expect(project.name).toEqual('Test Project')
	}))
})

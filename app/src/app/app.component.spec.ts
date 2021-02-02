import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { async, TestBed } from '@angular/core/testing'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { Platform } from '@ionic/angular'

import { PlatformMock, SplashScreenMock, StatusBarMock } from '../../test'
import { AppComponent } from './app.component'

describe('AppComponent', () => {
	let status: StatusBar
	let splash: SplashScreen
	let platform: Platform

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AppComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: StatusBar, useFactory: () => StatusBarMock.instance() },
				{ provide: SplashScreen, useFactory: () => SplashScreenMock.instance() },
				{ provide: Platform, useFactory: () => PlatformMock.instance() },
			],
		})

		status = TestBed.inject(StatusBar)
		splash = TestBed.inject(SplashScreen)
		platform = TestBed.inject(Platform)
	}))

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent)
		const component = fixture.debugElement.componentInstance
		expect(component).toBeTruthy()
	})

	it('should initialize the app', async () => {
		TestBed.createComponent(AppComponent)

		expect(platform.ready).toHaveBeenCalled()
		await platform
		expect(status.styleDefault).toHaveBeenCalled()
		expect(splash.hide).toHaveBeenCalled()
	})

	// TODO: add more tests!
})

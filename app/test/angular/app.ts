import { Observable, of } from 'rxjs'

import { createSpyObj } from '../utilities/create-spy'
import { NavControllerMock } from './nav-controller'

export class AppMock {
	public static instance(navCtrl?: NavControllerMock, viewObservable?: Observable<any>): any {
		const instance = createSpyObj('App', [
			'getActiveNav',
			'getActiveNavs',
			'getNavByIdOrName',
			'getRootNav',
			'getRootNavs',
			'getRootNavById',
			'isScrolling',
			'setTitle',
			'viewDidEnter',
			'viewDidLeave',
			'viewDidLoad',
			'viewWillEnter',
			'viewWillLeave',
			'viewWillUnload',
		])

		instance.getActiveNav.and.returnValue(navCtrl || NavControllerMock.instance())
		instance.getActiveNavs.and.returnValue(navCtrl || [NavControllerMock.instance()])
		instance.getNavByIdOrName.and.returnValue(navCtrl || NavControllerMock.instance())
		instance.getRootNav.and.returnValue(navCtrl || NavControllerMock.instance())
		instance.getRootNavs.and.returnValue(navCtrl || [NavControllerMock.instance()])
		instance.getRootNavById.and.returnValue(navCtrl || NavControllerMock.instance())
		instance.isScrolling.and.returnValue(false)
		instance.viewDidEnter.and.returnValue(viewObservable || of(undefined))
		instance.viewDidLoad.and.returnValue(viewObservable || of(undefined))
		instance.viewDidLeave.and.returnValue(viewObservable || of(undefined))
		instance.viewWillEnter.and.returnValue(viewObservable || of(undefined))
		instance.viewWillUnload.and.returnValue(viewObservable || of(undefined))
		instance.viewWillLeave.and.returnValue(viewObservable || of(undefined))
		instance.viewWillUnload.and.returnValue(viewObservable || of(undefined))

		return instance
	}
}

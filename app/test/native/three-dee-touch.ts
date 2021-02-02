import { EMPTY, of } from 'rxjs'

import { createSpyObj } from '../utilities/create-spy'

export class ThreeDeeTouchMock {
	public static instance(): any {
		const instance = createSpyObj('ThreeDeeTouch', [
			'isAvailable',
			'watchForTouches',
			'configureQuickActions',
			'onHomeIconPressed',
			'enableLinkPreview',
			'disableLinkPreview',
		])
		instance.isAvailable.and.returnValue(Promise.resolve(true))
		instance.watchForTouches.and.returnValue(of({}))
		instance.onHomeIconPressed.and.returnValue(EMPTY)

		return instance
	}
}

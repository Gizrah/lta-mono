import { EMPTY } from 'rxjs'

import { createSpyObj } from '../utilities/create-spy'

export class KeyboardMock {
	public static instance(): any {
		const instance = createSpyObj('Keyboard', [
			'hideKeyboardAccessoryBar',
			'show',
			'close',
			'disableScroll',
			'onKeyboardShow',
			'onKeyboardHide',
		])

		instance.onKeyboardShow.and.returnValue(EMPTY)
		instance.onKeyboardHide.and.returnValue(EMPTY)

		return instance
	}
}

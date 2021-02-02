import { EMPTY } from 'rxjs'

import { createSpyObj } from '../utilities/create-spy'

export class NetworkMock {
	public static instance(networkType: string): any {
		const instance = createSpyObj('Network', [
			'type',
			'downlinkMax',
			'onChange',
			'onDisconnect',
			'onConnect',
		])
		instance.type.and.returnValue(networkType || 'wifi')
		instance.downlinkMax.and.returnValue('42')
		instance.onChange.and.returnValue(EMPTY)
		instance.onDisconnect.and.returnValue(EMPTY)
		instance.onConnect.and.returnValue(EMPTY)
		return instance
	}
}

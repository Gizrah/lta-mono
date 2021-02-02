import { createSpyObj } from '../utilities/create-spy';
import { PopoverMock } from './popover';

export class PopoverControllerMock {
  public static instance(popOver?: PopoverMock): any {
    const instance = createSpyObj('PopoverController', ['create']);
    instance.create.and.returnValue(popOver || PopoverMock.instance());

    return instance;
  }
}

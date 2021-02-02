import { createSpyObj } from '../utilities/create-spy';
import { ActionSheetMock } from './action-sheet';

export class ActionSheetControllerMock {
  public static instance(actionSheet?: ActionSheetMock): any {
    const instance = createSpyObj('ActionSheetController', ['create']);
    instance.create.and.returnValue(actionSheet || ActionSheetMock.instance());

    return instance;
  }
}

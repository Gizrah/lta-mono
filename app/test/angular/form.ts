import { createSpyObj } from '../utilities/create-spy';

export class FormMock {
  public static instance(): any {
    const instance = createSpyObj('Form', [
      'register',
      'nextId',
      'deregister',
      'setAsFocused',
      'unsetAsFocused',
      'tabFocus'
    ]);

    instance.nextId.and.returnValue(0);

    return instance;
  }
}

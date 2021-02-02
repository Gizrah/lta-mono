import { createSpyObj } from '../utilities/create-spy';

export class LoadingMock {
  public static instance(): any {
    const instance = createSpyObj('Loading', [
      'present',
      'dismiss',
      'setContent',
      'setSpinner'
    ]);
    instance.present.and.returnValue(Promise.resolve());

    return instance;
  }
}

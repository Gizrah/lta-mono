import { createSpyObj } from '../utilities/create-spy';
import { LoadingMock } from './loading';

export class LoadingControllerMock {
  public static instance(loading?: LoadingMock): any {
    const instance = createSpyObj('LoadingController', ['create']);
    instance.create.and.returnValue(loading || LoadingMock.instance());

    return instance;
  }
}

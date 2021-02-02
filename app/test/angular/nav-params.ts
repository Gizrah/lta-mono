import { createSpyObj } from '../utilities/create-spy';

export class NavParamsMock {
  public static instance(getReturn?: any): any {
    const instance = createSpyObj('NavParams', ['get']);
    instance.get.and.returnValue(getReturn);

    return instance;
  }
}

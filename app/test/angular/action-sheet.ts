import { createSpyObj } from '../utilities/create-spy';

export class ActionSheetMock {
  public static instance(): any {
    const instance = createSpyObj('ActionSheet', ['present', 'dismiss']);
    instance.present.and.returnValue(Promise.resolve());
    instance.dismiss.and.returnValue(Promise.resolve());

    return instance;
  }
}

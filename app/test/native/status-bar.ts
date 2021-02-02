import { createSpyObj } from '../utilities/create-spy';

export class StatusBarMock {
  public static instance(): any {
    const instance = createSpyObj('StatusBar', [
      'overlaysWebView',
      'styleDefault',
      'styleLightContent',
      'styleBlackTranslucent',
      'styleBlackOpaque',
      'backgroundColorByName',
      'backgroundColorByHexString',
      'hide',
      'show'
    ]);

    instance['isVisible'] = true;

    return instance;
  }
}

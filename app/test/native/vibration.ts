import { createSpyObj } from '../utilities/create-spy';

export class VibrationMock {
  public static instance(): any {
    const instance = createSpyObj('Vibration', ['vibrate']);
    instance.vibrate.and.stub();
    return instance;
  }
}

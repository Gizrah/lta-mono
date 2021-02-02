import { createSpyObj } from '../utilities/create-spy';

export class HapticMock {
  public static instance(): any {
    const instance = createSpyObj('Haptic', [
      'available',
      'gestureSelectionChanged',
      'gestureSelectionEnd',
      'gestureSelectionStart',
      'impact',
      'notification',
      'selection'
    ]);
    instance.available.and.returnValue(true);

    return instance;
  }
}

import { createSpyObj } from '../utilities/create-spy';

export class FileMock {
  public applicationDirectory = 'a-directory';
  public applicationStorageDirectory = 'a-directory';
  public dataDirectory = 'a-directory';
  public cacheDirectory = 'a-directory';
  public externalApplicationStorageDirectory = 'a-directory';
  public externalDataDirectory = 'a-directory';
  public externalCacheDirectory = 'a-directory';
  public externalRootDirectory = 'a-directory';
  public tempDirectory = 'a-directory';
  public syncedDataDirectory = 'a-directory';
  public documentsDirectory = 'a-directory';
  public sharedDirectory = 'a-directory';
  public cordovaFileError: any;

  public static instance(): any {
    const instance = createSpyObj('File', [
      'getFreeDiskSpace',
      'checkDir',
      'createDir',
      'removeDir',
      'moveDir',
      'copyDir',
      'listDir',
      'removeRecursively',
      'checkFile',
      'createFile',
      'removeFile',
      'writeFile',
      'writeExistingFile',
      'readAsText',
      'readAsDataURL',
      'readAsBinaryString',
      'readAsArrayBuffer',
      'moveFile',
      'copyFile',
      'resolveLocalFilesystemUrl',
      'resolveDirectoryUrl',
      'getDirectory',
      'getFile'
    ]);

    instance.getFreeDiskSpace.and.returnValue(Promise.resolve(64));
    instance.checkDir.and.returnValue(Promise.resolve(true));
    instance.createDir.and.returnValue(Promise.resolve());
    instance.removeDir.and.returnValue(Promise.resolve());
    instance.moveDir.and.returnValue(Promise.resolve());
    instance.copyDir.and.returnValue(Promise.resolve());
    instance.listDir.and.returnValue(Promise.resolve());
    instance.removeRecursively.and.returnValue(Promise.resolve());
    instance.checkFile.and.returnValue(Promise.resolve(true));
    instance.createFile.and.returnValue(Promise.resolve());
    instance.removeFile.and.returnValue(Promise.resolve());
    instance.writeFile.and.returnValue(Promise.resolve());
    instance.writeExistingFile.and.returnValue(Promise.resolve());
    instance.readAsText.and.returnValue(Promise.resolve('a string'));
    instance.readAsDataURL.and.returnValue(
      Promise.resolve('data:,some%20data')
    );
    instance.readAsBinaryString.and.returnValue(Promise.resolve('101010'));
    instance.readAsArrayBuffer.and.returnValue(
      Promise.resolve(new ArrayBuffer(1))
    );
    instance.moveFile.and.returnValue(Promise.resolve());
    instance.copyFile.and.returnValue(Promise.resolve());
    instance.resolveLocalFilesystemUrl.and.returnValue(Promise.resolve());
    instance.resolveDirectoryUrl.and.returnValue(Promise.resolve());
    instance.getDirectory.and.returnValue(Promise.resolve());
    instance.getFile.and.returnValue(Promise.resolve());

    return instance;
  }
}

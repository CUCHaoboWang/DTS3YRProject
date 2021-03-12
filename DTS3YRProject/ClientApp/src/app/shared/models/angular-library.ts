import { ExternalConfigModel } from './external-config';
import { VideoSettingsModel } from './video-settings';

export class AngularLibraryModel extends ExternalConfigModel {
  private readonly NAME = 'Angular Library';

  constructor() {
    super();
  }

  setTokens(tokens: string[]) {
    if (tokens) {
      this.videoSettings.setScreenSharing(this.videoSettings.hasScreenSharing() && tokens?.length > 1);
      super.setTokens(tokens);
    }
  }

  public getComponentName() {
    return this.NAME;
  }
}

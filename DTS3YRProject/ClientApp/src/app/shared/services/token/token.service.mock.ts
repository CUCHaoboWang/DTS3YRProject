import { Injectable } from '@angular/core';
import { ExternalConfigModel } from '../../models/external-config';
import { VideoSettingsModel } from '../../models/video-settings';

@Injectable({
  providedIn: 'root'
})
export class TokenServiceMock {
  private webcamToken = '';
  private screenToken = '';
  private sessionId = '';
  private videoSettings: VideoSettingsModel;

  constructor() { }

  initialize(videoSettings: VideoSettingsModel) { }

  setSessionId(sessionId: string) { }

  getSessionId(): string {
    return '';
  }

  async initTokens(externalConfig: ExternalConfigModel) { }

  getWebcamToken(): string {
    return '';
  }

  getScreenToken(): string {
    return '';
  }

  private async generateWebcamToken(sessionId: string, ovUrl: string, ovSecret: string) { }

  private async generateScreenToken(sessionId: string, ovUrl: string, ovSecret: string) { }
}

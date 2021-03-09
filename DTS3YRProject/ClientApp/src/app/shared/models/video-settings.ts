import { VideoSettings } from '../types/video-settings';

export class VideoSettingsModel {
  private videoSettings: VideoSettings;

  constructor() {
    this.videoSettings = {
      chat: true,
      autopublish: false,
      toolbar: true,
      footer: true,
      toolbarButtons: {
        video: true,
        audio: true,
        fullscreen: true,
        screenShare: true,
        layoutSpeaking: true,
        exit: true
      }
    };
  }

  public set(videoSettings: VideoSettings) {
    this.videoSettings = videoSettings;
  }

  public isAutoPublish(): boolean {
    return this.videoSettings.autopublish;
  }

  public hasVideo(): boolean {
    return this.videoSettings.toolbarButtons.video;
  }

  public hasScreenSharing(): boolean {
    return this.videoSettings.toolbarButtons.screenShare;
  }

  public hasLayoutSpeaking(): boolean {
    return this.videoSettings.toolbarButtons.layoutSpeaking;
  }

  public hasFullscreen(): boolean {
    return this.videoSettings.toolbarButtons.fullscreen;
  }

  public hasAudio(): boolean {
    return this.videoSettings.toolbarButtons.audio;
  }

  public hasChat(): boolean {
    return this.videoSettings.chat;
  }
  public hasExit(): boolean {
    return this.videoSettings.toolbarButtons.exit;
  }

  public setScreenSharing(screenShare: boolean) {
    this.videoSettings.toolbarButtons.screenShare = screenShare;
  }

  public hasFooter(): boolean {
    return this.videoSettings.footer;
  }
  public hasToolbar(): boolean {
    return this.videoSettings.toolbar;
  }
}

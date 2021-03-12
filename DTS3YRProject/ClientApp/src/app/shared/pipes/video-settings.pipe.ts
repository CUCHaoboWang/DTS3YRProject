import { Pipe, PipeTransform } from '@angular/core';
import { VideoSettingsModel } from '../models/video-settings';

@Pipe({ name: 'hasChat', pure: true })
export class HasChatPipe implements PipeTransform {
  constructor() { }
  transform(videoSettings: VideoSettingsModel): boolean {
    return !videoSettings || videoSettings.hasChat();
  }
}

@Pipe({ name: 'hasAudio', pure: true })
export class HasAudioPipe implements PipeTransform {
  constructor() { }
  transform(videoSettings: VideoSettingsModel): boolean {
    return !videoSettings || videoSettings.hasAudio();
  }
}

@Pipe({ name: 'hasVideo', pure: true })
export class HasVideoPipe implements PipeTransform {
  constructor() { }
  transform(videoSettings: VideoSettingsModel): boolean {
    return !videoSettings || videoSettings.hasVideo();
  }
}

@Pipe({ name: 'isAutoPublish', pure: true })
export class IsAutoPublishPipe implements PipeTransform {
  constructor() { }
  transform(videoSettings: VideoSettingsModel): boolean {
    return !videoSettings || videoSettings.isAutoPublish();
  }
}

@Pipe({ name: 'hasScreenSharing', pure: true })
export class HasScreenSharingPipe implements PipeTransform {
  constructor() { }
  transform(videoSettings: VideoSettingsModel): boolean {
    return !videoSettings || videoSettings.hasScreenSharing();
  }
}

@Pipe({ name: 'hasFullscreen', pure: true })
export class HasFullscreenPipe implements PipeTransform {
  constructor() { }
  transform(videoSettings: VideoSettingsModel): boolean {
    return !videoSettings || videoSettings.hasFullscreen();
  }
}

@Pipe({ name: 'hasLayoutSpeaking', pure: true })
export class HasLayoutSpeakingPipe implements PipeTransform {
  constructor() { }
  transform(videoSettings: VideoSettingsModel): boolean {
    return !videoSettings || videoSettings.hasLayoutSpeaking();
  }
}

@Pipe({ name: 'hasExit', pure: true })
export class HasExitPipe implements PipeTransform {
  constructor() { }
  transform(videoSettings: VideoSettingsModel): boolean {
    return !videoSettings || videoSettings.hasExit();
  }
}

@Pipe({ name: 'hasToolbar', pure: true })
export class HasToolbarPipe implements PipeTransform {
  constructor() { }
  transform(videoSettings: VideoSettingsModel): boolean {
    return !videoSettings || videoSettings.hasToolbar();
  }
}

@Pipe({ name: 'hasFooter', pure: true })
export class HasFooterPipe implements PipeTransform {
  constructor() { }
  transform(videoSettings: VideoSettingsModel): boolean {
    return !videoSettings || videoSettings.hasFooter();
  }
}

import { VideoSettings } from '../types/video-settings';

export interface ISessionConfig {
  sessionName: string;
  user: string;
  tokens: string[];
  videoSettings: VideoSettings;
}

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

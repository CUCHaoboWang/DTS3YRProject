// Core Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// UI Modules
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OverlayContainer } from '@angular/cdk/overlay';

// Pipes
import { LinkifyPipe } from './shared/pipes/linkify';
import {
  HasChatPipe,
  HasAudioPipe,
  HasVideoPipe,
  IsAutoPublishPipe,
  HasScreenSharingPipe,
  HasFullscreenPipe,
  HasLayoutSpeakingPipe,
  HasExitPipe,
  HasFooterPipe,
  HasToolbarPipe
} from './shared/pipes/video-settings.pipe';
import { TooltipListPipe } from './shared/pipes/tooltipList.pipe';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { StreamComponent } from './shared/components/stream/stream.component';
import { ChatComponent } from './shared/components/chat/chat.component';
import { StreamVideoComponent } from './shared/components/stream/video.component';
import { DialogErrorComponent } from './shared/components/dialog-error/dialog-error.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { RoomConfigComponent } from './shared/components/room-config/room-config.component';
import { WebComponentComponent } from './web-component/web-component.component';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { ToolbarLogoComponent } from './shared/components/toolbar/logo.component';
import { VideoConferencingComponent } from './video-conferencing/video-conferencing.component';
import { VideoStreamingComponent } from './video-streaming/video-streaming.component';
import { VideoCallComponent } from './video-call/video-call.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';

// Services
import { NetworkService } from './shared/services/network/network.service';
import { WebrtcService } from './shared/services/webrtc/webrtc.service';
import { UtilsService } from './shared/services/utils/utils.service';
import { DevicesService } from './shared/services/devices/devices.service';
import { RemoteUsersService } from './shared/services/remote-users/remote-users.service';
import { ChatService } from './shared/services/chat/chat.service';
import { LoggerService } from './shared/services/logger/logger.service';
import { NotificationsService } from './shared/services/notifications/notifications.service';
import { StorageService } from './shared/services/storage/storage.service';
import { CdkOverlayContainer } from './shared/config/custom-cdk-overlay-container';
import { LocalUsersService } from './shared/services/local-users/local-users.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StreamComponent,
    ChatComponent,
    StreamVideoComponent,
    DialogErrorComponent,
    FooterComponent,
    RoomConfigComponent,
    WebComponentComponent,
    ToolbarComponent,
    ToolbarLogoComponent,
    LinkifyPipe,
    HasChatPipe,
    HasAudioPipe,
    HasVideoPipe,
    IsAutoPublishPipe,
    HasScreenSharingPipe,
    HasFullscreenPipe,
    HasLayoutSpeakingPipe,
    HasExitPipe,
    HasFooterPipe,
    HasToolbarPipe,
    TooltipListPipe,
    FetchDataComponent,
    VideoConferencingComponent,
    VideoStreamingComponent,
    VideoCallComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTooltipModule,
    MatBadgeModule,
    MatGridListModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatMenuModule,
    FlexLayoutModule
  ],
  entryComponents: [
    DialogErrorComponent,
    WebComponentComponent
  ],
  providers: [
    NetworkService,
    WebrtcService,
    LocalUsersService,
    UtilsService,
    RemoteUsersService,
    DevicesService,
    LoggerService,
    ChatService,
    NotificationsService,
    StorageService,
    CdkOverlayContainer,
    { provide: OverlayContainer, useClass: CdkOverlayContainer }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

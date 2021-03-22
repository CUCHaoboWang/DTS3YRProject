// Core Modules
import { environment } from 'src/environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

// UI Modules
import { FlexLayoutModule } from '@angular/flex-layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MaterialModule } from './material.module';

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
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { ToolbarLogoComponent } from './shared/components/toolbar/logo.component';
import { VideoConferencingComponent } from './video-conferencing/video-conferencing.component';
import { VideoStreamingComponent } from './video-streaming/video-streaming.component';
import { VideoCallComponent } from './video-call/video-call.component';

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
import { UserListComponent } from './video-call/user-list.component';

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
    VideoConferencingComponent,
    VideoStreamingComponent,
    VideoCallComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence()
  ],
  entryComponents: [
    DialogErrorComponent
  ],
  providers: [
    ChatService,
    CdkOverlayContainer,
    DevicesService,
    NetworkService,
    LocalUsersService,
    LoggerService,
    NotificationsService,
    RemoteUsersService,
    StorageService,
    UtilsService,
    WebrtcService,
    { provide: OverlayContainer, useClass: CdkOverlayContainer }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

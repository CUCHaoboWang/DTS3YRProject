import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VideoConferencingComponent } from './video-conferencing/video-conferencing.component';
import { VideoStreamingComponent } from './video-streaming/video-streaming.component';
import { VideoCallComponent } from './video-call/video-call.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
  { path: 'video-conferencing/:userName/:roomName', component: VideoConferencingComponent },
  { path: 'video-streaming/:userName/:roomName', component: VideoStreamingComponent },
  { path: 'video-call/:userName/:roomName', component: VideoCallComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule {}

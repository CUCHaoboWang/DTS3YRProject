import { Inject, Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { Subject } from 'rxjs';
import { SignalInfo, UserInfo } from './signalr.interface';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection: signalR.HubConnection;

  // Every Subject is an Observer.It is an object with the methods next(v), error(e), and complete().
  // To feed a new value to the Subject, just call next(theValue), and it will be multicasted to the Observers registered to listen to the Subject.

  private newPeer = new Subject<UserInfo>();
  public newPeer$ = this.newPeer.asObservable();

  private notification = new Subject<UserInfo>();
  public notification$ = this.notification.asObservable();

  private disconnectedPeer = new Subject<UserInfo>();
  public disconnectedPeer$ = this.disconnectedPeer.asObservable();

  private signal = new Subject<SignalInfo>();
  public signal$ = this.signal.asObservable();

  constructor(@Inject('BASE_URL') private baseUrl: string) { }

  public async startConnection(userName: string, roomName: string): Promise<void> {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseUrl + 'signalr')
      .build();

    await this.hubConnection.start();
    console.log(`Connection started for user ${userName} in room ${roomName}`);

    this.hubConnection.on('UserJoined', (data) => {
      this.newPeer.next(JSON.parse(data));
    });

    this.hubConnection.on('SendNotification', (data) => {
      this.notification.next(JSON.parse(data));
    });

    this.hubConnection.on('UserDisconnected', (data) => {
      this.disconnectedPeer.next(JSON.parse(data));
    });

    this.hubConnection.on('SendSignal', (user, signal) => {
      this.signal.next({ user, signal });
    });

    this.hubConnection.invoke('OnJoined', userName);
  }

  public sendNotificationToUser(userName: string, user: string): void {
    this.hubConnection.invoke('SendNotification', userName, user);
  }

  public sendSignalToUser(signal: string, user: string) {
    this.hubConnection.invoke('SendSignal', signal, user);
  }
}

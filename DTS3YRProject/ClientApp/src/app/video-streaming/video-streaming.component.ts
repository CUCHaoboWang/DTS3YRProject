import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { LoggerService } from '../shared/services/logger/logger.service';
import { StorageService } from '../shared/services/storage/storage.service';
import { WebrtcFirebaseService } from '../shared/services/webrtc-firebase/webrtc-firebase.service';
import { BehaviorSubject } from 'rxjs';
import { ILogger } from '../shared/types/logger-type';
import { DocType } from '../shared/services/webrtc-firebase/firebase.interface';

const getObservable = (collection: AngularFirestoreCollection<RTCIceCandidateInit>) => {
  const subject = new BehaviorSubject([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: RTCIceCandidateInit[]) => {
    subject.next(val);
  });
  return subject;
};

@Component({
  selector: 'app-video-streaming',
  templateUrl: './video-streaming.component.html',
  styleUrls: ['./video-streaming.component.css']
})
export class VideoStreamingComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayerLocal') videoPlayerLocal: ElementRef;
  @ViewChild('videoPlayerRemote') videoPlayerRemote: ElementRef;

  myNickName: string;
  mySessionId: string;

  private log: ILogger;
  private servers: any;
  private localStream: MediaStream;
  private remoteStream: MediaStream;
  private peerConnection: RTCPeerConnection;
  private collectionName: string = 'calls';
  private callDoc: AngularFirestoreDocument<any>;
  private offerCandidatesCollection: AngularFirestoreCollection<RTCIceCandidateInit>;
  private answerCandidatesCollection: AngularFirestoreCollection<RTCIceCandidateInit>;
  private offerCandidatesObservables: BehaviorSubject<RTCIceCandidateInit[]>;
  private answerCandidatesObservables: BehaviorSubject<RTCIceCandidateInit[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loggerSrv: LoggerService,
    private webRTCService: WebrtcFirebaseService,
    private fireStore: AngularFirestore
  ) {
    this.log = this.loggerSrv.get('VideoStreamingComponent');
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.myNickName = params.userName;
      this.mySessionId = params.roomName;
    });

    // Reference Firestore collections for signaling
    this.callDoc = this.fireStore.collection(this.collectionName).doc(this.mySessionId);
    this.offerCandidatesCollection = this.callDoc.collection('offerCandidates');
    this.answerCandidatesCollection = this.callDoc.collection('answerCandidates');
    this.offerCandidatesObservables = getObservable(this.offerCandidatesCollection);
    this.answerCandidatesObservables = getObservable(this.answerCandidatesCollection);

    // Use google stun server
    this.servers = {
      iceServers: [
        {
          urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
      ],
      iceCandidatePoolSize: 10,
    };

    this.peerConnection = new RTCPeerConnection(this.servers);
  }

  public async initLocalUser() {
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.remoteStream = new MediaStream();

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    this.videoPlayerLocal.nativeElement.srcObject = this.localStream;
    if (this.localStream) {
      this.videoPlayerLocal.nativeElement.load();
      this.videoPlayerLocal.nativeElement.play();
    }

    this.videoPlayerRemote.nativeElement.srcObject = this.remoteStream;

    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream.addTrack(track);

        if (this.remoteStream.getTracks().length > 0) {
          this.videoPlayerRemote.nativeElement.load();
          this.videoPlayerRemote.nativeElement.play();
        }
      });
    };
  }

  //public createSession() {

  //  this.callDoc.snapshotChanges().forEach((change) => {
  //    const data = change.payload.data() as DocType;
  //    console.log('Create Session CallDoc onSnapshotChanges');
  //    console.log(data);

  //    if (!this.peerConnection.currentRemoteDescription && data?.answer) {
  //      const answerDescription = new RTCSessionDescription(data.answer);
  //      this.peerConnection.setRemoteDescription(answerDescription);
  //    }
  //  })

  //}

  // CREATE OFFER
  public async createOffer() {
    this.log.d(`Firestore Call Document Reference Id: ${this.mySessionId}`);

    // Get candidates for caller, save to db
    // An ice canditate contains a potential ip address and port pair that can be used to establish the peer-to-peer connection
    this.peerConnection.onicecandidate = (event) => {
      event.candidate && this.offerCandidatesCollection.add(event.candidate.toJSON());
    };

    // Create offer
    const offerDescription: RTCSessionDescriptionInit = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offerDescription);

    // SDP - Inportant information to negotiate the connection
    const offer: RTCSessionDescriptionInit = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await this.callDoc.set({ offer });

    // Listen for remote answer
    //this.callDoc.get().subscribe((doc) => {
    //  const data = doc.data() as DocInfo;
    //  console.log('Create Offer CallDoc onValueChanges');
    //  console.log(data);

    //  if (!this.peerConnection.currentRemoteDescription && data?.answer) {
    //    const answerDescription = new RTCSessionDescription(data.answer);
    //    this.peerConnection.setRemoteDescription(answerDescription);
    //  }
    //})

    // Listen for remote answer
    this.callDoc.snapshotChanges().forEach((change) => {
      const data = change.payload.data() as DocType;
      console.log('Create Offer CallDoc onSnapshotChanges');
      console.log(data);

      if (!this.peerConnection.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        this.peerConnection.setRemoteDescription(answerDescription);
      }
    })

    // When answered, add candidate to peer connection
    //this.answerCandidatesCollection.get().subscribe((collection) => {
    //  collection.docChanges().forEach((change) => {
    //    console.log('Create Offer Answer Candidates onDocChanges');
    //    console.log(change);

    //    if (change.type === 'added') {
    //      this.peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
    //    }
    //  })
    //});

    this.answerCandidatesCollection.snapshotChanges().forEach((changes) => {
      changes.forEach((change) => {

        console.log('Create Offer Answer Candidates onSnapshotChanges');
        console.log(change.payload.doc.data());

        if (change.type === 'added') {
          this.peerConnection.addIceCandidate(new RTCIceCandidate(change.payload.doc.data()));
        }
      });
    });
  }

  // ANSWER OFFER TEST
  //public async answerOffer() {
  //  // Reference Firestore collections for signaling
  //  const callDoc = this.fireStore.collection(this.collectionName).doc(this.callId);
  //  const offerCandidatesCollection: AngularFirestoreCollection<RTCIceCandidateInit> = callDoc.collection('offerCandidates');
  //  const answerCandidatesCollection: AngularFirestoreCollection<RTCIceCandidateInit> = callDoc.collection('answerCandidates');

  //  this.log.d(`Firestore Call Document Reference Id: ${this.callId}`);

  //  const calls = this.fireStore.collection(this.collectionName).doc(this.callId).valueChanges({ idField: 'id' });
  //  const offerCandidates = getObservable(this.fireStore.collection(this.collectionName).doc(this.callId).collection('offerCandidates'));
  //  const answerCandidates = getObservable(this.fireStore.collection(this.collectionName).doc(this.callId).collection('answerCandidates'));

  //  console.log(callDoc.snapshotChanges());
  //  console.log(offerCandidatesCollection.snapshotChanges());
  //  console.log(answerCandidatesCollection.snapshotChanges());

  //  console.log(calls);
  //  console.log(offerCandidates.getValue());
  //  console.log(answerCandidates.getValue());

  //  callDoc.get().subscribe((doc) => {
  //    console.log(doc.data());
  //  });

  //  offerCandidatesCollection.get().subscribe((collection) => {
  //    collection.docs.forEach((doc) => {
  //      console.log(doc.data());
  //    });
  //  });
  //}

  // ANSWER OFFER
  public async answerOffer() {
    this.log.d(`Firestore Call Document Reference Id: ${this.mySessionId}`);

    // Get candidates for answerer, save to db
    this.peerConnection.onicecandidate = (event) => {
      event.candidate && this.answerCandidatesCollection.add(event.candidate.toJSON());
    };

    // Get offer
    this.callDoc.get().subscribe((doc) => {
      console.log('Answer Offer CallDoc onValueChanges');
      console.log(doc.data() as DocType);

      const offer = (doc.data() as DocType).offer;

      console.log('Answer Offer CallDoc onValueChanges offerDescription');
      console.log(offer);

      const offerDescription = new RTCSessionDescription(offer);
      this.peerConnection.setRemoteDescription(offerDescription);

      // Create answer
      this.peerConnection.createAnswer().then((answerDescription) => {
        this.peerConnection.setLocalDescription(answerDescription);

        const answer: RTCSessionDescriptionInit = {
          sdp: answerDescription.sdp,
          type: answerDescription.type
        };

        this.callDoc.update({ answer });
      });
    });

    // When answered, add candidate to peer connection
    //this.offerCandidatesCollection.get().subscribe((collection) => {
    //  collection.docChanges().forEach((change) => {
    //    console.log('Answer Offer Offer Candidates onDocChanges');
    //    console.log(change);

    //    if (change.type === 'added') {
    //      this.peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
    //    }
    //  })
    //})

    this.offerCandidatesCollection.snapshotChanges().forEach((changes) => {
      changes.forEach((change) => {

        console.log('Answer Offer Offer Candidates onSnapshotChanges');
        console.log(change.payload.doc.data());

        if (change.type === 'added') {
          this.peerConnection.addIceCandidate(new RTCIceCandidate(change.payload.doc.data()));
        }
      });
    });
  }

  stopStreamedVideo() {
    const stream = this.localStream;
    const tracks = stream.getTracks();

    tracks.forEach(function (track) {
      track.stop();
    });

    this.videoPlayerLocal.nativeElement.srcObject = null;
  }

  leaveSession() {
    this.log.d('Leaving session...');
    this.stopStreamedVideo();
    this.router.navigate(['']);
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    this.leaveSession();
  }

  ngOnDestroy() {
    this.leaveSession();
  }
}

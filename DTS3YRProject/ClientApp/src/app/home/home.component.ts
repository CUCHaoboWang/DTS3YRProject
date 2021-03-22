import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from '../shared/services/utils/utils.service';
import { uniqueNamesGenerator, adjectives, animals  } from 'unique-names-generator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  isExpanded = false;

  public entryForm: FormGroup;

  constructor(private router: Router, private utilsSrv: UtilsService, public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.entryForm = new FormGroup({
      userName: new FormControl('', [Validators.minLength(4), Validators.required]),
      roomName: new FormControl('', [Validators.minLength(4), Validators.required]),
      roomType: new FormControl('', Validators.required)
    });
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  public generateRandomName() {
    const randomUserName = this.utilsSrv.generateNickname();
    const randomRoomName = uniqueNamesGenerator({ dictionaries: [adjectives, animals ], separator: '-', });

    this.entryForm.controls['userName'].setValue(randomUserName);
    this.entryForm.controls['roomName'].setValue(randomRoomName);
  }

  public goToVideoCall() {
    this.entryForm.controls['roomType'].setValue('video-call');

    this.onSubmit();
  }

  public goToVideoStreaming() {
    this.entryForm.controls['roomType'].setValue('video-streaming');

    this.onSubmit();
  }

  public goToVideoConferencing() {
    this.entryForm.controls['roomType'].setValue('video-conferencing');

    this.onSubmit();
  }

  public onSubmit() {
    if (this.entryForm.valid) {
      const userName = this.entryForm.controls['userName'].value;
      const roomName = this.entryForm.controls['roomName'].value.replace(/ /g, '-'); // replace white spaces by -
      const roomType = this.entryForm.controls['roomType'].value;
      this.entryForm.controls['roomName'].setValue(roomName);

      this.router.navigate(['/' + roomType, userName, roomName]);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public roomForm: FormGroup;

  constructor(private router: Router, public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.roomForm = new FormGroup({
      roomName: new FormControl('', [Validators.minLength(4), Validators.required]),
      roomType: new FormControl('', Validators.required)
    });
  }

  public generateRandomName() {
    const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], separator: '-', });
    this.roomForm.controls['roomName'].setValue(randomName);
  }

  public goToVideoCall() {
    this.roomForm.controls['roomType'].setValue('video-call');

    this.onSubmit();
  }

  public goToVideoStreaming() {
    this.roomForm.controls['roomType'].setValue('video-streaming');

    this.onSubmit();
  }

  public goToVideoConferencing() {
    this.roomForm.controls['roomType'].setValue('video-conferencing');

    this.onSubmit();
  }

  public onSubmit() {
    if (this.roomForm.valid) {
      const roomName = this.roomForm.controls['roomName'].value.replace(/ /g, '-'); // replace white spaces by -
      const roomType = this.roomForm.controls['roomType'].value;
      this.roomForm.controls['roomName'].setValue(roomName);

      this.router.navigate(['/' + roomType, roomName]);
    }
  }
}

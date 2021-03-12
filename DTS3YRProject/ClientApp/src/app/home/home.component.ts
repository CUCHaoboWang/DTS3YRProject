import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
  //styleUrls: ['./home.component.css', './home.component.animate.css', './home.component.bootstrap.css', './home.component.slick.css']
})
export class HomeComponent {
  isExpanded = false;

  public roomForm: FormGroup;

  constructor(private router: Router, public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.roomForm = new FormGroup({
      roomName: new FormControl('', [Validators.minLength(4), Validators.required]),
      roomType: new FormControl('', Validators.required)
    });

    //const preloader = document.getElementById('preloader');
    //setTimeout(function () {
    //  preloader.style.display = 'none';
    //}, 1500);
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  public generateRandomName() {
    const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, animals], separator: '-', });
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

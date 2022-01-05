import { Component, OnInit } from '@angular/core';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.less']
})
export class VideoComponent implements OnInit {
  allowedExtensions = fileUploadConfiguration.videoExtensions;

  constructor() { }

  ngOnInit(): void {
  }

}

import { Injectable } from '@angular/core';
import RecordRTC from 'recordrtc';
import { Subject } from 'rxjs';

interface RecordedVideoOutput {
  blob: Blob;
  url: string;
  title: string;
}
@Injectable({
  providedIn: 'root'
})

export class ScreenRecorderService {
  commonConfig = {
    onMediaCaptured: (stream) => {
      this.callbackScreen(stream);
    },
    onMediaStopped: () => {
      this.stopRecording();
    },
    onMediaCapturingFailed: (error) => {
      console.error('onMediaCapturingFailed:', error);

      if (error.toString().indexOf('no audio or video tracks available') !== -1) {
        alert('RecordRTC failed to start because there are no audio or video tracks available.');
      }
    }
  };
  nav: Navigator;
  recorder: RecordRTC;
  audio: MediaStream;
  screen: MediaStream;
  _recorded = new Subject<RecordedVideoOutput>();

  constructor() { }

  startRecording(): any {
    this.nav = navigator;
    // @ts-ignore
    this.nav.mediaDevices.getDisplayMedia({
      video: {
        width: 1920,
        height: 1080,
      }
    }).then(screenStream => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(mic => {
        screenStream.addTrack(mic.getTracks()[0]);
        this.audio = mic;
        this.screen = screenStream
        this.commonConfig.onMediaCaptured(screenStream);
        this.addStreamStopListener(screenStream, () => {
          this.commonConfig.onMediaStopped();
        });
      });
    });
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.stopRecording(this.processVideo.bind(this));
    }
  }

  private callbackScreen(stream: any) {
    var options = {
      type: "video",
      mimeType: "video/webm",
      disableLogs: false,
      getNativeBlob: false, // enable it for longer recordings
      canvas: {
        width: 1920,
        height: 1080,
      },
    };
    this.recorder = new RecordRTC(stream, options);
    this.recorder.startRecording();
  }

  private processVideo(audioVideoWebMURL) {
    const recordedBlob = this.recorder.getBlob();
    this.recorder.getDataURL(function (dataURL) { });
    const recordedName = encodeURIComponent('video_' + new Date().getTime() + '.webm');
    this._recorded.next({ blob: recordedBlob, url: audioVideoWebMURL, title: recordedName });
    this.stopMedia();
    this.downloadFile(recordedBlob, 'video/mp4', recordedName);
  }

  private downloadFile(data: any, type: string, filename: string): any {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;

      if (this.audio) {
        this.audio = null;
        this.screen = null;
      }
    }
  }

  private addStreamStopListener(stream, callback) {
    stream.addEventListener('ended', function () {
      callback();
      callback = function () { };
    }, false);
    stream.addEventListener('inactive', function () {
      callback();
      callback = function () { };
    }, false);
    stream.getTracks().forEach(function (track) {
      track.addEventListener('ended', function () {
        callback();
        callback = function () { };
      }, false);
      track.addEventListener('inactive', function () {
        callback();
        callback = function () { };
      }, false);
    });
  }
}

import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import * as _ from 'lodash';

class MachineDevice {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

@Component({
  selector: 'app-device-settings',
  templateUrl: './device-settings.component.html',
  styleUrls: ['./device-settings.component.less']
})
export class DeviceSettingsComponent extends AppComponentBase implements OnInit {
  @Output() joinRoom = new EventEmitter();

  videoDevices: MachineDevice[] = [];
  audioDevices: MachineDevice[] = [];
  outputDevices: MachineDevice[] = [];

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
      .then(() => {
        navigator.mediaDevices.enumerateDevices()
          .then(devices => {
            _.each(devices, device => {
              switch (device.kind) {
                case 'audioinput':
                  this.audioDevices.push(new MachineDevice(device.label));
                  break;
                case 'videoinput':
                  this.videoDevices.push(new MachineDevice(device.label));
                  break;
                case 'audiooutput':
                  this.outputDevices.push(new MachineDevice(device.label));
                  break;
              }
            });
          });
      });
  }

  onJoinRoomClick(): void {
    this.joinRoom.emit();
  }
}

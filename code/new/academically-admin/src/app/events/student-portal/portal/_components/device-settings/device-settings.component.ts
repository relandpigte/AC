import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import * as _ from 'lodash';

class MachineDevice {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class SelectedMachineDevice {
  videoDevice: MachineDevice;
  audioDevice: MachineDevice;
  outputDevice: MachineDevice;
}

@Component({
  selector: 'app-device-settings',
  templateUrl: './device-settings.component.html',
  styleUrls: ['./device-settings.component.less']
})
export class DeviceSettingsComponent extends AppComponentBase implements OnInit {
  @Output() joinRoom = new EventEmitter<SelectedMachineDevice>();

  videoDevices: MachineDevice[] = [];
  audioDevices: MachineDevice[] = [];
  outputDevices: MachineDevice[] = [];
  selectedMediaDevice = new SelectedMachineDevice();
  devicesLoaded = false;

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
                  this.audioDevices.push(new MachineDevice(device.deviceId, device.label));
                  break;
                case 'videoinput':
                  this.videoDevices.push(new MachineDevice(device.deviceId, device.label));
                  break;
                case 'audiooutput':
                  this.outputDevices.push(new MachineDevice(device.deviceId, device.label));
                  break;
              }
            });

            this.selectedMediaDevice.videoDevice = this.videoDevices[0];
            this.selectedMediaDevice.audioDevice = this.audioDevices[0];
            this.selectedMediaDevice.outputDevice = this.outputDevices[0];
            this.devicesLoaded = true;
          });
      });
  }

  onJoinRoomClick(): void {
    this.joinRoom.emit(this.selectedMediaDevice);
  }
}

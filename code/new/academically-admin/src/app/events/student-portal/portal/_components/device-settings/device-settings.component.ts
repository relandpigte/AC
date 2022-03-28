import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

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
    this.videoDevices.push(new MachineDevice('Video Device 1'));
    this.videoDevices.push(new MachineDevice('Video Device 2'));
    this.videoDevices.push(new MachineDevice('Video Device 3'));

    this.audioDevices.push(new MachineDevice('Audio Device 1'));
    this.audioDevices.push(new MachineDevice('Audio Device 2'));
    this.audioDevices.push(new MachineDevice('Audio Device 3'));

    this.outputDevices.push(new MachineDevice('Output Device 1'));
    this.outputDevices.push(new MachineDevice('Output Device 2'));
    this.outputDevices.push(new MachineDevice('Output Device 3'));
  }

  onJoinRoomClick(): void {
    this.joinRoom.emit();
  }
}

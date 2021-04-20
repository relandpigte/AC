import { Component, OnInit } from '@angular/core';

class Service {
  constructor(id: number, name: string, children?: Service[]) {
    this.id = id;
    this.name = name;
    this.children = children;
  }

  id: number;
  name: string
  children: Service[];
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.less']
})
export class ServicesComponent implements OnInit {
  collapsedItems: boolean[] = [];
  services: Service[] = [];

  constructor() {
    this.services = [
      new Service(
        1,
        'School Admissions',
        [
          new Service(11, 'Assessments coaching'),
          new Service(12, 'Interview coaching'),
        ],
      ),
      new Service(
        2,
        'University Admissions',
        [
          new Service(21, 'CV Building'),
          new Service(22, 'Personal statement coaching'),
          new Service(23, 'Art & design portfolio coaching'),
          new Service(24, 'Reference letter translation'),
          new Service(25, 'Sample writing coaching'),
          new Service(26, 'Admissions test coaching'),
          new Service(27, 'Interview coaching'),
        ],
      ),
    ];
    this.services.forEach(service => {
      if (service.id == 1) {
        this.collapsedItems[service.id] = false;
      } else {
        this.collapsedItems[service.id] = true;
      }
    });
  }

  ngOnInit(): void {
  }

  onToggleCollapse(id: number): void {
    this.collapsedItems[id] = !this.collapsedItems[id];
  }
}

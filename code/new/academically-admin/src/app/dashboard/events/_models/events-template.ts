import { EventType, WorkshopType } from '@shared/service-proxies/service-proxies';

export class EventsTemplate {
  type: WorkshopType | EventType;
  name: string;
  description: string;
}

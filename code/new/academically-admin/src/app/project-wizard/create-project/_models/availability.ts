import { DayOfWeek } from '@shared/service-proxies/service-proxies';

export class Availability {
  dayOfWeek: DayOfWeek;
  times: { startTime: Date, endTime: Date }[] = [];
}

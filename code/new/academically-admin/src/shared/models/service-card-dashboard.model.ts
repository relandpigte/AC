import { ServiceCardPeople, ServiceCardPerson, ServiceCardType } from './service-card.model';

export interface ServiceCardDashboard {
  type: ServiceCardType;
  name?: string;
  description?: string;
  owner: ServiceCardPerson;
  people?: ServiceCardPeople;
}

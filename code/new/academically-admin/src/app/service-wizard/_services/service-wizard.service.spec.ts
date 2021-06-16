import { TestBed } from '@angular/core/testing';

import { ServiceWizardService } from './service-wizard.service';

describe('ServiceWizardService', () => {
  let service: ServiceWizardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceWizardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

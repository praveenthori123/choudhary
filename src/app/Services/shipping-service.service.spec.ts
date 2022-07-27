import { TestBed } from '@angular/core/testing';

import { ShippingServiceService } from './shipping-service.service';

describe('ShippingServiceService', () => {
  let service: ShippingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

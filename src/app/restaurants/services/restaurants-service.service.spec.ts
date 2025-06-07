import { TestBed } from '@angular/core/testing';

import { RestaurantsService } from './restaurants-service.service';

describe('RestaurantsServiceService', () => {
  let service: RestaurantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

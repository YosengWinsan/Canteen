import { TestBed, inject } from '@angular/core/testing';

import { CanteenService } from './canteen.service';

describe('CanteenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanteenService]
    });
  });

  it('should be created', inject([CanteenService], (service: CanteenService) => {
    expect(service).toBeTruthy();
  }));
});

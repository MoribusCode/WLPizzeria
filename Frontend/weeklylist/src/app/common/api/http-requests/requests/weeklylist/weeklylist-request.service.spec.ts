import { TestBed } from '@angular/core/testing';

import { WeeklylistRequestService } from './weeklylist-request.service';

describe('WeeklylistRequestService', () => {
  let service: WeeklylistRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklylistRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

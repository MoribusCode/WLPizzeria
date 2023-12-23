import { TestBed } from '@angular/core/testing';

import { CalendarRequestService } from './calendar-request.service';

describe('CalendarRequestService', () => {
  let service: CalendarRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

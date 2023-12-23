import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeCalendarComponent } from './visualize-calendar.component';

describe('VisualizeCalendarComponent', () => {
  let component: VisualizeCalendarComponent;
  let fixture: ComponentFixture<VisualizeCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizeCalendarComponent]
    });
    fixture = TestBed.createComponent(VisualizeCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

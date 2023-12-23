import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenvenuesChartComponent } from './renvenues-chart.component';

describe('RenvenuesChartComponent', () => {
  let component: RenvenuesChartComponent;
  let fixture: ComponentFixture<RenvenuesChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenvenuesChartComponent]
    });
    fixture = TestBed.createComponent(RenvenuesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

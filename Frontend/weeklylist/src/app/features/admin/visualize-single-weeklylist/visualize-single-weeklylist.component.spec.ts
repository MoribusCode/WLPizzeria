import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeSingleWeeklylistComponent } from './visualize-single-weeklylist.component';

describe('VisualizeSingleWeeklylistComponent', () => {
  let component: VisualizeSingleWeeklylistComponent;
  let fixture: ComponentFixture<VisualizeSingleWeeklylistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizeSingleWeeklylistComponent]
    });
    fixture = TestBed.createComponent(VisualizeSingleWeeklylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

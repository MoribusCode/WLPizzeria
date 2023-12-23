import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeSingleWeeklylistNotDraftedComponent } from './visualize-single-weeklylist-not-drafted.component';

describe('VisualizeSingleWeeklylistNotDraftedComponent', () => {
  let component: VisualizeSingleWeeklylistNotDraftedComponent;
  let fixture: ComponentFixture<VisualizeSingleWeeklylistNotDraftedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizeSingleWeeklylistNotDraftedComponent]
    });
    fixture = TestBed.createComponent(VisualizeSingleWeeklylistNotDraftedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

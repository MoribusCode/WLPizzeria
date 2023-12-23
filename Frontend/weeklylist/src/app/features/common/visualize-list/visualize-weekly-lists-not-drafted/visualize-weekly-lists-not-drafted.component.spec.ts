import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeWeeklyListsNotDraftedComponent } from './visualize-weekly-lists-not-drafted.component';

describe('VisualizeWeeklyListsNotDraftedComponent', () => {
  let component: VisualizeWeeklyListsNotDraftedComponent;
  let fixture: ComponentFixture<VisualizeWeeklyListsNotDraftedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizeWeeklyListsNotDraftedComponent]
    });
    fixture = TestBed.createComponent(VisualizeWeeklyListsNotDraftedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

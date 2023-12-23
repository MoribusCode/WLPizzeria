import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeWeeklyListsComponent } from './visualize-weekly-lists.component';

describe('VisualizeWeeklyListsComponent', () => {
  let component: VisualizeWeeklyListsComponent;
  let fixture: ComponentFixture<VisualizeWeeklyListsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizeWeeklyListsComponent]
    });
    fixture = TestBed.createComponent(VisualizeWeeklyListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

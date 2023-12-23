import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeRevenuesComponent } from './visualize-revenues.component';

describe('VisualizeRevenuesComponent', () => {
  let component: VisualizeRevenuesComponent;
  let fixture: ComponentFixture<VisualizeRevenuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizeRevenuesComponent]
    });
    fixture = TestBed.createComponent(VisualizeRevenuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

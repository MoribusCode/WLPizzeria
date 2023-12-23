import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizePermissionDeniedComponent } from './visualize-permission-denied.component';

describe('VisualizePermissionDeniedComponent', () => {
  let component: VisualizePermissionDeniedComponent;
  let fixture: ComponentFixture<VisualizePermissionDeniedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizePermissionDeniedComponent]
    });
    fixture = TestBed.createComponent(VisualizePermissionDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

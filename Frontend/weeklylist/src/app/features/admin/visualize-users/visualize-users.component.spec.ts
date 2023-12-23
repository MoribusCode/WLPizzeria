import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeUsersComponent } from './visualize-users.component';

describe('VisualizeUsersComponent', () => {
  let component: VisualizeUsersComponent;
  let fixture: ComponentFixture<VisualizeUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizeUsersComponent]
    });
    fixture = TestBed.createComponent(VisualizeUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

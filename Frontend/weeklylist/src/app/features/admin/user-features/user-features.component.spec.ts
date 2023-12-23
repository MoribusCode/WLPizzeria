import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFeaturesComponent } from './user-features.component';

describe('UserFeaturesComponent', () => {
  let component: UserFeaturesComponent;
  let fixture: ComponentFixture<UserFeaturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserFeaturesComponent]
    });
    fixture = TestBed.createComponent(UserFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

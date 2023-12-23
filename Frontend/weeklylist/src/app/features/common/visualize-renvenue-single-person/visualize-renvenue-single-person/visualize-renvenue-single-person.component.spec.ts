import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeRenvenueSinglePersonComponent } from './visualize-renvenue-single-person.component';

describe('VisualizeRenvenueSinglePersonComponent', () => {
  let component: VisualizeRenvenueSinglePersonComponent;
  let fixture: ComponentFixture<VisualizeRenvenueSinglePersonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizeRenvenueSinglePersonComponent]
    });
    fixture = TestBed.createComponent(VisualizeRenvenueSinglePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

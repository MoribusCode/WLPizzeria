import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListButtonComponent } from './list-button.component';

describe('ListButtonComponent', () => {
  let component: ListButtonComponent;
  let fixture: ComponentFixture<ListButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListButtonComponent]
    });
    fixture = TestBed.createComponent(ListButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

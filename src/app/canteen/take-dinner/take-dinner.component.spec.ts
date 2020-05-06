import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeDinnerComponent } from './take-dinner.component';

describe('TakeDinnerComponent', () => {
  let component: TakeDinnerComponent;
  let fixture: ComponentFixture<TakeDinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeDinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeDinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

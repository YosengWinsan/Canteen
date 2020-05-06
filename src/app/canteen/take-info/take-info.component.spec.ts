import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeInfoComponent } from './take-info.component';

describe('TakeInfoComponent', () => {
  let component: TakeInfoComponent;
  let fixture: ComponentFixture<TakeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

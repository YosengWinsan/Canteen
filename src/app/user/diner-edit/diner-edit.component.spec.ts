import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DinerEditComponent } from './diner-edit.component';

describe('DinerEditComponent', () => {
  let component: DinerEditComponent;
  let fixture: ComponentFixture<DinerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DinerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DinerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

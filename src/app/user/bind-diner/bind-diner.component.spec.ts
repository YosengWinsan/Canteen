import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BindDinerComponent } from './bind-diner.component';

describe('BindDinerComponent', () => {
  let component: BindDinerComponent;
  let fixture: ComponentFixture<BindDinerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BindDinerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BindDinerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

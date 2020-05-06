import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetErrorComponent } from './net-error.component';

describe('NetErrorComponent', () => {
  let component: NetErrorComponent;
  let fixture: ComponentFixture<NetErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

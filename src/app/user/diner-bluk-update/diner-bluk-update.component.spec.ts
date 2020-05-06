import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DinerBlukUpdateComponent } from './diner-bluk-update.component';

describe('DinerBlukUpdateComponent', () => {
  let component: DinerBlukUpdateComponent;
  let fixture: ComponentFixture<DinerBlukUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DinerBlukUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DinerBlukUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

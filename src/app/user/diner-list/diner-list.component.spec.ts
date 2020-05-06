import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DinerListComponent } from './diner-list.component';

describe('DinerListComponent', () => {
  let component: DinerListComponent;
  let fixture: ComponentFixture<DinerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DinerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DinerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

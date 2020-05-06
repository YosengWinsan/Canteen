import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DinnerInfoComponent } from './dinner-info.component';

describe('InfoComponent', () => {
    let component: DinnerInfoComponent;
    let fixture: ComponentFixture<DinnerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [DinnerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(DinnerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

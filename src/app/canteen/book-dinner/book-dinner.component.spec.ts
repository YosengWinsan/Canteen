import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDinnerComponent } from './book-dinner.component';

describe('BookDinnerComponent', () => {
  let component: BookDinnerComponent;
  let fixture: ComponentFixture<BookDinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookDinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContacttodayComponent } from './contacttoday.component';

describe('ContacttodayComponent', () => {
  let component: ContacttodayComponent;
  let fixture: ComponentFixture<ContacttodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContacttodayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContacttodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

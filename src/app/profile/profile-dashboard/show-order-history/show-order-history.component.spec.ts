import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOrderHistoryComponent } from './show-order-history.component';

describe('ShowOrderHistoryComponent', () => {
  let component: ShowOrderHistoryComponent;
  let fixture: ComponentFixture<ShowOrderHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowOrderHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

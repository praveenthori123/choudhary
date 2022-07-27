import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdressModalComponent } from './adress-modal.component';

describe('AdressModalComponent', () => {
  let component: AdressModalComponent;
  let fixture: ComponentFixture<AdressModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdressModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdressModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

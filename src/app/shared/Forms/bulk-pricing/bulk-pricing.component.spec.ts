import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPricingComponent } from './bulk-pricing.component';

describe('BulkPricingComponent', () => {
  let component: BulkPricingComponent;
  let fixture: ComponentFixture<BulkPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkPricingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

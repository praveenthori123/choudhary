import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnProductListingComponent } from './return-product-listing.component';

describe('ReturnProductListingComponent', () => {
  let component: ReturnProductListingComponent;
  let fixture: ComponentFixture<ReturnProductListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnProductListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnProductListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

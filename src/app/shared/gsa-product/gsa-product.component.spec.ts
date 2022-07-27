import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GSAProductComponent } from './gsa-product.component';

describe('GSAProductComponent', () => {
  let component: GSAProductComponent;
  let fixture: ComponentFixture<GSAProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GSAProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GSAProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

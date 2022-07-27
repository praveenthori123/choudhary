import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CannabisComponent } from './cannabis.component';

describe('CannabisComponent', () => {
  let component: CannabisComponent;
  let fixture: ComponentFixture<CannabisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CannabisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CannabisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

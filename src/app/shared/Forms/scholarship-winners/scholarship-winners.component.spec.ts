import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipWinnersComponent } from './scholarship-winners.component';

describe('ScholarshipWinnersComponent', () => {
  let component: ScholarshipWinnersComponent;
  let fixture: ComponentFixture<ScholarshipWinnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScholarshipWinnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScholarshipWinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

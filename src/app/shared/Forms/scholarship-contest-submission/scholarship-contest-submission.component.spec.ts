import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipContestSubmissionComponent } from './scholarship-contest-submission.component';

describe('ScholarshipContestSubmissionComponent', () => {
  let component: ScholarshipContestSubmissionComponent;
  let fixture: ComponentFixture<ScholarshipContestSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScholarshipContestSubmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScholarshipContestSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

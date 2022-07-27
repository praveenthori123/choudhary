import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternOnboardingFormComponent } from './intern-onboarding-form.component';

describe('InternOnboardingFormComponent', () => {
  let component: InternOnboardingFormComponent;
  let fixture: ComponentFixture<InternOnboardingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternOnboardingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternOnboardingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

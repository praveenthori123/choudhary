import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomBlandSolutionComponent } from './custom-bland-solution.component';

describe('CustomBlandSolutionComponent', () => {
  let component: CustomBlandSolutionComponent;
  let fixture: ComponentFixture<CustomBlandSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomBlandSolutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomBlandSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskChemistComponent } from './ask-chemist.component';

describe('AskChemistComponent', () => {
  let component: AskChemistComponent;
  let fixture: ComponentFixture<AskChemistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskChemistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskChemistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcatgorycomponentComponent } from './subcatgorycomponent.component';

describe('SubcatgorycomponentComponent', () => {
  let component: SubcatgorycomponentComponent;
  let fixture: ComponentFixture<SubcatgorycomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcatgorycomponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcatgorycomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerpagesComponent } from './innerpages.component';

describe('InnerpagesComponent', () => {
  let component: InnerpagesComponent;
  let fixture: ComponentFixture<InnerpagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InnerpagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerpagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaBannerComponent } from './media-banner.component';

describe('MediaBannerComponent', () => {
  let component: MediaBannerComponent;
  let fixture: ComponentFixture<MediaBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

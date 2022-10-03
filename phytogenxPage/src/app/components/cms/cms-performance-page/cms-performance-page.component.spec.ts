import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsPerformancePageComponent } from './cms-performance-page.component';

describe('CmsPerformancePageComponent', () => {
  let component: CmsPerformancePageComponent;
  let fixture: ComponentFixture<CmsPerformancePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsPerformancePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsPerformancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

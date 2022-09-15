import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbPerformancePageComponent } from './qb-performance-page.component';

describe('QbPerformancePageComponent', () => {
  let component: QbPerformancePageComponent;
  let fixture: ComponentFixture<QbPerformancePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbPerformancePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbPerformancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

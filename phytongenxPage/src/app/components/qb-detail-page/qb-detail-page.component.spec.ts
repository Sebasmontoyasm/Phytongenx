import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbDetailPageComponent } from './qb-detail-page.component';

describe('QbDetailPageComponent', () => {
  let component: QbDetailPageComponent;
  let fixture: ComponentFixture<QbDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbDetailPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

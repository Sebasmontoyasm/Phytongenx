import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbPageComponent } from './qb-page.component';

describe('QbPageComponent', () => {
  let component: QbPageComponent;
  let fixture: ComponentFixture<QbPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsDetailPageComponent } from './cms-detail-page.component';

describe('CmsDetailPageComponent', () => {
  let component: CmsDetailPageComponent;
  let fixture: ComponentFixture<CmsDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsDetailPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

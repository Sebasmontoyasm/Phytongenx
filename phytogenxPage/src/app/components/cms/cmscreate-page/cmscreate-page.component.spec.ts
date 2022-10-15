import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmscreatePageComponent } from './cmscreate-page.component';

describe('CmscreatePageComponent', () => {
  let component: CmscreatePageComponent;
  let fixture: ComponentFixture<CmscreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmscreatePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmscreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

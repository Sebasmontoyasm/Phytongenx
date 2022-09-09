import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataPageComponent } from './master-data-page.component';

describe('MasterDataPageComponent', () => {
  let component: MasterDataPageComponent;
  let fixture: ComponentFixture<MasterDataPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDataPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

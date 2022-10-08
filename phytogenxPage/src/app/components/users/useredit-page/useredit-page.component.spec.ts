import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsereditPageComponent } from './useredit-page.component';

describe('UsereditPageComponent', () => {
  let component: UsereditPageComponent;
  let fixture: ComponentFixture<UsereditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsereditPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsereditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

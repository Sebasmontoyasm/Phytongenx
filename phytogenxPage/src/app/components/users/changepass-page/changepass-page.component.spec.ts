import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangepassPageComponent } from './changepass-page.component';

describe('ChangepassPageComponent', () => {
  let component: ChangepassPageComponent;
  let fixture: ComponentFixture<ChangepassPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangepassPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangepassPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogdeletePageComponent } from './dialogdelete-page.component';

describe('DialogdeletePageComponent', () => {
  let component: DialogdeletePageComponent;
  let fixture: ComponentFixture<DialogdeletePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogdeletePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogdeletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

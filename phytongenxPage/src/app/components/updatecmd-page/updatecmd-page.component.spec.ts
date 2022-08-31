import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatecmdPageComponent } from './updatecmd-page.component';

describe('UpdatecmdPageComponent', () => {
  let component: UpdatecmdPageComponent;
  let fixture: ComponentFixture<UpdatecmdPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatecmdPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatecmdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserslogsPageComponent } from './userslogs-page.component';

describe('UserslogsPageComponent', () => {
  let component: UserslogsPageComponent;
  let fixture: ComponentFixture<UserslogsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserslogsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserslogsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

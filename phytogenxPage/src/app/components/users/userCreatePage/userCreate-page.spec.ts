import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreatePageComponent} from './userCreate-page.component';

describe('UserCreatePageComponent', () => {
  let component: UserCreatePageComponent;
  let fixture: ComponentFixture<UserCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

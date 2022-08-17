import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFacturaPageComponent } from './add-factura-page.component';

describe('AddFacturaPageComponent', () => {
  let component: AddFacturaPageComponent;
  let fixture: ComponentFixture<AddFacturaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFacturaPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFacturaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

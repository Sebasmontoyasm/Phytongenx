import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFacturaPageComponent } from './edit-factura-page.component';

describe('EditFacturaPageComponent', () => {
  let component: EditFacturaPageComponent;
  let fixture: ComponentFixture<EditFacturaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFacturaPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFacturaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

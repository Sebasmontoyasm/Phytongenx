import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetFacturaPageComponent } from './get-factura-page.component';

describe('GetFacturaPageComponent', () => {
  let component: GetFacturaPageComponent;
  let fixture: ComponentFixture<GetFacturaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetFacturaPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetFacturaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

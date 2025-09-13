import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasProblemasComponent } from './ventas-problemas.component';

describe('VentasProblemasComponent', () => {
  let component: VentasProblemasComponent;
  let fixture: ComponentFixture<VentasProblemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasProblemasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasProblemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Vendedor } from 'src/app/core/models/vendedor.model';

@Component({
  selector: 'app-select-vendedor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <select
      [(ngModel)]="cliente[campo]"
      (change)="emitirCambio()"
      class="form-select form-select-sm"
    >
      <option [ngValue]="null"> Sin asignar </option>
      <option *ngFor="let vendedor of vendedores" [ngValue]="vendedor.id_usuario">
        {{ vendedor.nombre_usuario }}
      </option>
    </select>
  `
})
export class SelectVendedorComponent {
  @Input() cliente: any;
  @Input() campo: string = '';
  @Input() vendedores: Vendedor[] = [];

  @Output() cambio = new EventEmitter<{ cliente: any; campo: string; valor: any }>();

  emitirCambio() {
    this.cambio.emit({
      cliente: this.cliente,
      campo: this.campo,
      valor: this.cliente[this.campo]
    });
  }
}

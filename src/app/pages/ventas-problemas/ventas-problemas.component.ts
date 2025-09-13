import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from 'src/app/core/config/constants';

@Component({
  standalone: true,
  selector: 'app-ventas-problemas',
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas-problemas.component.html',
  styleUrls: ['./ventas-problemas.component.scss']
})
export class VentasProblemasComponent implements OnInit {
  ventas: any[] = [];
  cargando = true;
  busqueda = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerVentasProblemas();
  }

  obtenerVentasProblemas(): void {
    this.cargando = true;
    this.http.get<any>(API_ENDPOINTS.obtenerVentasProblemas).subscribe({
      next: resp => {
        this.ventas = resp.status ? resp.ventas : [];
        this.cargando = false;
      },
      error: () => {
        this.ventas = [];
        this.cargando = false;
      }
    });
  }

  get ventasFiltradas(): any[] {
    const q = this.busqueda.trim().toLowerCase();
    return q
      ? this.ventas.filter(
          v =>
            v.nombre_cliente.toLowerCase().includes(q) ||
            (v.id_venta + '').includes(q)
        )
      : [...this.ventas];
  }

  liberarVenta(v: any): void {
    Swal.fire({
      title: '¿Liberar venta?',
      text: `Venta #${v.id_venta} - Cliente: ${v.nombre_cliente}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, liberar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.http
          .post<any>(API_ENDPOINTS.liberarVentaProblema, { id_venta: v.id_venta })
          .subscribe({
            next: resp => {
              if (resp.status) {
                Swal.fire('Éxito', 'Venta liberada con éxito', 'success');
                this.obtenerVentasProblemas();
              } else {
                Swal.fire('Error', resp.message || 'Error desconocido', 'error');
              }
            },
            error: () => {
              Swal.fire('Error', 'No se pudo liberar la venta', 'error');
            }
          });
      }
    });
  }
}

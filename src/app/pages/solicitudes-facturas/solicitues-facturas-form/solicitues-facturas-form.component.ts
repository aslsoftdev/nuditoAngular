import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { API_ENDPOINTS } from 'src/app/core/config/constants';
import Swal from 'sweetalert2';

interface SolicitudFactureResponse {
  status: boolean;
  message?: string;
  informacion_factura: SolicitudFactura;
}

interface SolicitudFactura {
  facturada: boolean;
  comentarios: string;
}

@Component({
  selector: 'app-solicitues-facturas-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitues-facturas-form.component.html',
  styleUrl: './solicitues-facturas-form.component.scss'
})
export class SolicituesFacturasFormComponent implements OnInit {
 esEdicion = false;
 cargando = false;
 factura?: SolicitudFactura;
 id_factura = 0;

 constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router
 ){}

 ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.esEdicion = true;
      this.cargarFactura(+id);
      this.id_factura = +id;
    }
  })
 }

 private cargarFactura(id: number): void {
    this.cargando = true;
    
    const payload = {
      case: 'obtener_solicitud_factura',
      id_solicitud: id
    };


    this.http.post<SolicitudFactureResponse>(`${API_ENDPOINTS.solicitudesFactura}`, payload).subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.status) {
          this.factura = {
            ...response.informacion_factura,
            facturada: Boolean(Number(response.informacion_factura.facturada))
          };
        }else {
          Swal.fire('Error', response.message || 'Error al cargar la factura', 'error');
        }
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudo cargar la factura', 'error');
      }
    })
 }

  actualizarFactura(): void {
    if(!this.factura) return;

    const payload = {
      case: 'actualizar_solicitud_factura',
      id_solicitud: this.id_factura,
      facturada: this.factura.facturada,
      comentarios: this.factura.comentarios
    };

    this.http.post(API_ENDPOINTS.solicitudesFactura, payload).subscribe({
      next: () => {
        Swal.fire('Exito', 'Factura actualizada correctamente', 'success');
        this.router.navigate(['/solicitudes-facturas']);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar la factura', 'error');
      }
    })
  }
}

import {
  HttpClient
} from '@angular/common/http';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  RouterModule
} from '@angular/router';
import {
  API_ENDPOINTS
} from 'src/app/core/config/constants';
import {
  FormsModule
} from '@angular/forms';
import Swal from 'sweetalert2';
import {
  CommonModule
} from '@angular/common';

import {
  SolicitudFactura,
  SolicitudFacturaresponse
} from 'src/app/core/models/factura.model';

@Component({
  standalone: true,
  selector: 'app-solicitudes-facturas',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './solicitudes-facturas.component.html',
  styleUrls: ['./solicitudes-facturas.component.scss']
})
export class SolicitudesFacturasComponent implements OnInit {
  facturas: SolicitudFactura[] = [];
  cargando = true;
  soloActivos = true;
  busqueda = '';
  usuarioId = +(localStorage.getItem('id_usuario') || 0);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerSolicitudes();
  }

  obtenerSolicitudes(): void {
    this.cargando = true;

    const payload = {
      action: 'lista_solicitudes_factura',
      usuario: this.usuarioId,
    };

    this.http.post < SolicitudFacturaresponse > (API_ENDPOINTS.solicitudesFactura, payload).subscribe({
      next: (response) => {
        this.facturas = response.status ? response.solicitudes_factura : [];
        this.cargando = false;
      },
      error: () => {
        this.facturas = [];
        this.cargando = false;
      }
    });
  }

  get solicitudesFiltradas(): SolicitudFactura[] {
    const q = this.busqueda.trim().toLowerCase();
    return q ?
      this.facturas.filter(r => r.nombre_cliente.toLowerCase().includes(q)) : [...this.facturas];
  }

  cambiarEstado(u: SolicitudFactura): void {
    const esArchivado = u.activa === 3;
    const accion = esArchivado ? 'archivar' : 'activar';

    Swal.fire({
      title: `¿Deseas ${accion} esta solicitud de factura?`,
      text: `Cliente: ${u.nombre_cliente}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        // Si el usuario confirma, realiza la petición para cambiar el estado
        this.http.post < SolicitudFacturaresponse > (API_ENDPOINTS.solicitudesFactura, {}).subscribe({
          next: resp => {
            if (resp.status) {
              this.obtenerSolicitudes(); // Si es exitoso, recarga la lista de vendedores
            } else {
              Swal.fire('Error', resp.mensaje || 'Error desconocido', 'error'); // Muestra error si la respuesta no es exitosa
            }
          },
          error: () => {
            Swal.fire('Error', 'No se pudo actualizar el estado.', 'error'); // Muestra error si la petición falla
          }
        });
      }
    });
  }
}

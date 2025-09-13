import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { API_ENDPOINTS } from 'src/app/core/config/constants';
import Swal from 'sweetalert2';

import { Vendedor } from 'src/app/core/models/vendedor.model';
import { NgSelectModule } from '@ng-select/ng-select';

import { ToastrService } from 'ngx-toastr';

interface ActualizarAgenteResponse {
  status: boolean;
  message: string;
}

interface ConsultaVendedorResponses {
  status: boolean;
  mensaje?: string;
  vendedores: Vendedor[];
}

interface TablerosClientesResponse {
  status: boolean;
  message?: string;
  clientes: Tableros[];
}

interface Tableros {
  id_cliente: number;
  nombre_cliente: string;
  agente_lunes: number | null;
  agente_martes: number | null;
  agente_miercoles: number | null;
  agente_jueves: number | null;
  agente_viernes: number | null;
  agente_sabado: number | null;
  agente_domingo: number | null;
  // flags de edición dinámica
  editando_agente_lunes: boolean;
  editando_agente_martes: boolean;
  editando_agente_miercoles: boolean;
  editando_agente_jueves: boolean;
  editando_agente_viernes: boolean;
  editando_agente_sabado: boolean;
  editando_agente_domingo: boolean;
}

@Component({
  selector: 'app-tablero-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './tablero-clientes.component.html',
  styleUrl: './tablero-clientes.component.scss'
})
export class TableroClientesComponent implements OnInit {
  vendedores: Vendedor[] = [];
  tablerosClientes: Tableros[] = [];
  tablerosClientesOriginal: Tableros[] = [];
  cargandoClientes = false;
  cargandoVendedores = false;
  busqueda = '';

  constructor(private http: HttpClient, 
              private toastr: ToastrService) {}

  ngOnInit(): void {
    this.obtenerTableroClientes();
    this.obtenerVendedores();
  }

  onBuscar() {
    this.cargandoClientes = true;
    const texto = this.busqueda.trim().toLowerCase();

    setTimeout(() => {
      if (!texto) {
        this.tablerosClientes = [...this.tablerosClientesOriginal];
      } else {
        this.tablerosClientes = this.tablerosClientesOriginal.filter(cliente =>
          cliente.nombre_cliente.toLowerCase().includes(texto)
        );
      }
      this.cargandoClientes = false;
    }, 300);
  }

  obtenerTableroClientes(): void {
    this.cargandoClientes = true;
    this.http.post<TablerosClientesResponse>(API_ENDPOINTS.obtenerTableroClientes, {}).subscribe({
      next: (response) => {
        if (response.status) {
          this.tablerosClientes = response.clientes.map(c => ({
            ...c,
            editando_agente_lunes: false,
            editando_agente_martes: false,
            editando_agente_miercoles: false,
            editando_agente_jueves: false,
            editando_agente_viernes: false,
            editando_agente_sabado: false,
            editando_agente_domingo: false,
          }));
          this.tablerosClientesOriginal = response.clientes;
        } else {
          Swal.fire('Error', response.message || 'No se pudieron cargar los clientes', 'error');
        }
        this.cargandoClientes = false;
      },
      error: () => {
        this.cargandoClientes = false;
      }
    });
  }

  obtenerVendedores(): void {
    this.cargandoVendedores = true;
    this.http.post<ConsultaVendedorResponses>(API_ENDPOINTS.obtenerVendedores, {}).subscribe({
      next: (response) => {
        this.vendedores = response.status ? response.vendedores : [];
        this.cargandoVendedores = false;
      },
      error: () => {
        this.vendedores = [];
        this.cargandoVendedores = false;
      }
    });
  }

  activarEdicion(cliente: Tableros, campo: string) {
    // cierra otros campos
    (Object.keys(cliente) as Array<keyof Tableros>).forEach(k => {
      if (k.startsWith('editando_')) {
        (cliente as any)[k] = false;
      }
    });

    (cliente as any)[`editando_${campo}`] = true;
  }

  guardarCambio(cliente: Tableros, campo: string) {
    (cliente as any)[`editando_${campo}`] = false;

    this.http.post<ActualizarAgenteResponse>(
      API_ENDPOINTS.actualizarTableroCliente,
      { clientes: [cliente] }
    ).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success('Agente actualizado con éxito');
        } else {
          this.toastr.error(response.message || 'No se pudo actualizar');
        }
      },
      error: () => {
        this.toastr.error('No se pudo actualizar el cliente');
      }
    });
  }

  tieneFoto(id: number | null): boolean {
    if (!id) return false;
    const vendedor = this.vendedores.find(v => v.id_usuario === id);
    return !!(vendedor && vendedor.imagen_url);
  }

  obtenerFotoVendedor(id: number | null): string {
    if (!id) return '';
    const vendedor = this.vendedores.find(v => v.id_usuario === id);
    return vendedor?.imagen_url || '';
  }

  obtenerInicialesVendedor(id: number | null): string {
    if (!id) return '';
    const vendedor = this.vendedores.find(v => v.id_usuario === id);
    if (!vendedor) return '';
    const partes = vendedor.nombre_usuario.split(' ');
    return (partes[0][0] + (partes[1]?.[0] || '')).toUpperCase();
  }

  onImageError(event: Event, id: number) {
    (event.target as HTMLImageElement).style.display = 'none';
  }

}

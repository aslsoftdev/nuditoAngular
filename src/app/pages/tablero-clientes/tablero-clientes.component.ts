import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { API_ENDPOINTS } from 'src/app/core/config/constants';
import Swal from 'sweetalert2';

import { Vendedor } from 'src/app/core/models/vendedor.model';

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
  clientes: Tableros[]; // Define el tipo de datos según tu necesidad
}

interface Tableros {
  id_cliente: number;
  nombre_cliente: string;
  agente_lunes: number;
  agente_martes: number;
  agente_miercoles: number;
  agente_jueves: number;
  agente_viernes: number;
  agente_sabado: number;
  agente_domingo: number;
}

@Component({
  selector: 'app-tablero-clientes',
  imports: [CommonModule, FormsModule],
  templateUrl: './tablero-clientes.component.html',
  styleUrl: './tablero-clientes.component.scss'
})
export class TableroClientesComponent implements OnInit {
  vendedores: Vendedor [] = [];
  tablerosClientes: Tableros[] = [];
  tablerosClientesOriginal: Tableros[] = [];
  cargandoClientes = false;
  cargandoVendedores = false;
  busqueda = '';

  constructor(private http: HttpClient) {}

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
  }, 500); // 500ms para ver la animación
}

  obtenerTableroClientes(): void {
    this.cargandoClientes = true;
    this.http.post<TablerosClientesResponse>(API_ENDPOINTS.obtenerTableroClientes, {}).subscribe({
      next: (response) => {
        if (response.status) {
          this.cargandoClientes = false;
          this.tablerosClientes = response.clientes;
          this.tablerosClientesOriginal = response.clientes;
        } else {
          Swal.fire('Error', response.message || 'No se pudieron cargar los clientes', 'error');
        }
      },
      error: () => {
        this.cargandoClientes = false;
      }
    })
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
    })
  }

  
  mensaje = '';
  tipoMensaje: 'success' | 'error' = 'success';

  onAgenteChange(cliente: unknown, campo: string, nuevoId: unknown) {

  cliente[campo] = nuevoId;

    this.http.post<ActualizarAgenteResponse>(API_ENDPOINTS.actualizarTableroCliente, { clientes: [cliente] }).subscribe({
      next: (response) => {
        this.tipoMensaje = response.status ? 'success' : 'error';
      this.mensaje = response.message;
      setTimeout(() => this.mensaje = '', 3000);
      },
      error: () => {
             this.tipoMensaje = 'error';
      this.mensaje = 'No se pudo actualizar el cliente';
      setTimeout(() => this.mensaje = '', 3000);
      }
    })

  // Aquí puedes hacer una petición HTTP para guardar el cambio en el backend si lo necesitas.
  // Por ejemplo:
  // this.miServicio.actualizarAgente(cliente.id_cliente, campo, nuevoId).subscribe(...);
}
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { API_ENDPOINTS } from 'src/app/core/config/constants';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

interface DineroEntregado {
  total_efectivo: number;
  total_transferencias: number;
  total_faltante: number;
}

interface ExistenciaProducto {
  producto: number;
  existencia_inicial: number;
  total_vendido: number;
  existencia_final: number;
  existencia_real: number;
  diferencia: number;
  regresar_almacen: number;
  total_devoluciones: number;
}

interface Ruta {
  id_ruta: number;
  usuario: number;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_cerrada: string;
  total_faltante: number;
  json_dinero_entregado: string;
  json_existencias: string;
  cerrada_por: number;
  activa: number;
  nombre: string;
  estado_actual: string;
  total_efectivo: number;
  total_tarjeta: number;
  total_transferencias: number;
  total_credito: number;
  total_pagos_creditos_efectivo: number;
  total_pagos_creditos_tarjeta: number;
  total_pagos_creditos_transferencias: number;
}

interface RutasResponse {
  status: boolean;
  rutas: Ruta[];
}

@Component({
  standalone: true,
  selector: 'app-listas-rutas',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listarutas.component.html',
  styleUrls: ['./listarutas.component.scss']
})
export class ListarutasComponent implements OnInit {
  rutas: Ruta[] = [];
  cargando = true;
  soloActivos = true; // Bandera para filtrar solo rutas activas
  busqueda = '';
  usuarioId = +(localStorage.getItem('id_usuario') || 0);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerRutas();
  }

  obtenerRutas(): void {
    this.cargando = true;
    this.http.post<RutasResponse>( `${API_ENDPOINTS.obtenerRutasidCliente}?id_usuario=${this.usuarioId}`, {}).subscribe({
      next: (response) => {
        this.rutas = response.status ? response.rutas : [];
        this.cargando = false;
      },
      error: () => {
        this.rutas = [];
        this.cargando = false;
      }
    });
  }

  get rutasFiltradas(): Ruta[] {
    const q = this.busqueda.trim().toLowerCase();
    return q
      ? this.rutas.filter(r =>
        r.nombre.toLowerCase().includes(q)
      )
      : [...this.rutas];
  }

  onBuscar(): void {
    // No es necesario, el getter hace el filtro automáticamente
  }
}

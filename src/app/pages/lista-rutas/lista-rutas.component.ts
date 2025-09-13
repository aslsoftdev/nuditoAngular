import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { API_ENDPOINTS } from 'src/app/core/config/constants';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

import { RutasResponse, Ruta } from 'src/app/core/models/rutas.model';

@Component({
  standalone: true,
  selector: 'app-listas-rutas',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lista-rutas.component.html',
  styleUrls: ['./lista-rutas.component.scss']
})
export class ListarutasComponent implements OnInit {
  rutas: Ruta[] = [];
  cargando = true;
  soloActivos = true; // Bandera para filtrar solo rutas activas
  busqueda = '';
  usuarioId = +(localStorage.getItem('id_usuario') || 0);
  filtros = {
    agente: '',
    estado: '%',
    fechaInicio: '',
    fechaFin: ''
  };

  vendedores: any[] = []; // Aquí cargas los vendedores desde la API

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.setDefaultDates();
    this.obtenerVendedores();
    this.obtenerRutas();
  }
  
  // Establecer fechas por defecto (último mes hasta hoy)
  setDefaultDates(): void {
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(hoy.getMonth() - 1);

    this.filtros.fechaInicio = haceUnMes.toISOString().split('T')[0];
    this.filtros.fechaFin = hoy.toISOString().split('T')[0];
  }

   obtenerVendedores(): void {
    this.http.get<any>(API_ENDPOINTS.obtenerVendedores).subscribe({
      next: (resp) => {
        this.vendedores = resp.status ? resp.vendedores : [];
      },
      error: () => {
        this.vendedores = [];
      }
    });
  }

  obtenerRutas(): void {
    this.cargando = true;
    const params = {
      filtro: this.filtros.estado,
      vendedor: this.filtros.agente || 0,
      fecha_inicio: this.filtros.fechaInicio,
      fecha_fin: this.filtros.fechaFin
    };

    this.http.get<RutasResponse>(API_ENDPOINTS.obtenerRutas, { params }).subscribe({
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

  regresarEnProceso(ruta: any): void {
    Swal.fire({
      title: '¿Regresar ruta?',
      text: 'Esto moverá la ruta al estado "En Proceso".',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, regresar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(API_ENDPOINTS.actualizarEstadoRuta, { id_ruta: ruta.id_ruta }).subscribe({
          next: (resp: any) => {
            if (resp.status) {
              Swal.fire('Ruta actualizada', 'La ruta se regresó a En Proceso', 'success');
              this.obtenerRutas();
            } else {
              Swal.fire('Error', resp.message || 'No se pudo regresar la ruta', 'error');
            }
          },
          error: () => {
            Swal.fire('Error', 'No se pudo regresar la ruta', 'error');
          }
        });
      }
    });
  }

  terminarRuta(ruta: any): void {
    Swal.fire({
      title: '¿Terminar ruta?',
      text: 'Una vez terminada el vendedor ya no podrá realizar ventas.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, terminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(API_ENDPOINTS.terminarRuta, {
          id_usuario: ruta.usuario,
          id_ruta: ruta.id_ruta
        }).subscribe({
          next: (resp: any) => {
            if (resp.status) {
              Swal.fire('Ruta terminada', resp.message || 'La ruta fue terminada con éxito', 'success');
              this.obtenerRutas(); // refrescar listado
            } else {
              Swal.fire('Error', resp.message || 'No se pudo terminar la ruta', 'error');
            }
          },
          error: () => {
            Swal.fire('Error', 'No se pudo terminar la ruta', 'error');
          }
        });
      }
    });
  }

  archivarRuta(ruta: any): void {
    Swal.fire({
      title: '¿Archivar ruta?',
      text: 'Esto marcará la ruta como archivada y no se podrá modificar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, archivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(API_ENDPOINTS.archivarRuta, {
          id_usuario: ruta.usuario,
          id_ruta: ruta.id_ruta
        }).subscribe({
          next: (resp: any) => {
            if (resp.status) {
              Swal.fire('Ruta archivada', resp.message || 'La ruta fue archivada con éxito', 'success');
              this.obtenerRutas();
            } else {
              Swal.fire('Error', resp.message || 'No se pudo archivar la ruta', 'error');
            }
          },
          error: () => {
            Swal.fire('Error', 'No se pudo archivar la ruta', 'error');
          }
        });
      }
    });
  }

}

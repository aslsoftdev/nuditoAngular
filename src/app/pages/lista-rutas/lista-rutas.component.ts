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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerRutas();
  }

  obtenerRutas(): void {
    this.cargando = true;
    this.http.post<RutasResponse>( `${API_ENDPOINTS.obtenerRutas}?filtro=%`, {}).subscribe({
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
        r.nombre_usuario.toLowerCase().includes(q)
      )
      : [...this.rutas];
  }

  onBuscar(): void {
    // No es necesario, el getter hace el filtro automáticamente
  }
}

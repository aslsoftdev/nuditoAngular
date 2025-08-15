import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { API_ENDPOINTS } from 'src/app/core/config/constants';
import Swal from 'sweetalert2';

import { RutaPorid, Ruta } from 'src/app/core/models/ruta-por-id.model';

@Component({
  selector: 'app-lista-rutas-form',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  templateUrl: './lista-rutas-form.component.html',
  styleUrl: './lista-rutas-form.component.scss'
})
export class ListaRutasFormComponent implements OnInit {
  esEdicion = false;
  cargando = false;
  ruta?: Ruta;

    constructor(
      private fb: FormBuilder,
      private http: HttpClient,
      private route: ActivatedRoute,
      private router: Router
    ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.esEdicion = true;
        this.cargarRuta(+id);
      }
    });
  }

  private cargarRuta(id: number): void {
    this.cargando = true;
    this.http.post<RutaPorid>(`${API_ENDPOINTS.obtenerRutasPorId}?id_ruta=${id}`, {}).subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.status) {
         this.ruta = response.route[0];
          console.log('RUTA', this.ruta);
        } else {
          Swal.fire('Error', response.message || 'Error al cargar la ruta', 'error');
        }
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudo cargar la ruta', 'error');
      }
    });
  }
}

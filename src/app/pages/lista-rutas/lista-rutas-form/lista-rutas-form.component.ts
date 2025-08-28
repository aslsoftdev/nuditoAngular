import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { API_ENDPOINTS } from 'src/app/core/config/constants';
import Swal from 'sweetalert2';

import { RutaPorid, Ruta, Visita } from 'src/app/core/models/ruta-por-id.model';

// Pipe para filtrar visitas
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroVisitas',
  standalone: true
})
export class FiltroVisitasPipe implements PipeTransform {
  transform(visitas: Visita[], search: string): Visita[] {
    if (!visitas) return [];
    if (!search) return visitas;

    const texto = search.toLowerCase();
    return visitas.filter(v =>
      v.nombre_cliente?.toLowerCase().includes(texto) ||
      v.nombre_clasificacion?.toLowerCase().includes(texto)
    );
  }
}

@Component({
  selector: 'app-lista-rutas-form',
  standalone: true,
  imports: [CommonModule, FormsModule, FiltroVisitasPipe],
  templateUrl: './lista-rutas-form.component.html',
  styleUrls: ['./lista-rutas-form.component.scss']
})
export class ListaRutasFormComponent implements OnInit {
  esEdicion = false;
  cargando = false;
  ruta?: Ruta;
  busqueda: string = '';

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
          this.ruta = response.route as unknown as Ruta;
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

  // 👉 Método para calcular el total de ventas de una visita
  calcularTotal(visita: Visita): number {
    if (!visita.ventas) return 0;
    return visita.ventas.reduce((s, v) => s + (v.total || 0), 0);
  }
}

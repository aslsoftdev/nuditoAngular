import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ConsultarKpisResponse } from 'src/app/core/models/kpis.model';
import { API_ENDPOINTS } from 'src/app/core/config/constants';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  // Variables para KPIs
  kpis: ConsultarKpisResponse['kpis'] | null = null;
  fecha: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarKpis();
  }

  private cargarKpis(): void {
    this.loading = true;
    this.http.get<ConsultarKpisResponse>(API_ENDPOINTS.obtenerKpis).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.kpis = resp.kpis;
          this.fecha = resp.fecha;
        } else {
          Swal.fire('Aviso', 'No se pudieron obtener los KPIs', 'info');
        }
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los KPIs', 'error');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

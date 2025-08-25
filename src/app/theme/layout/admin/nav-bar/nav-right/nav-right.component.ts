// src/app/theme/layout/nav-right/nav-right.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { RouterModule, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from 'src/app/core/config/constants';

interface MensajeConteoVentasPendientes {
  status: boolean;
  count: number;
}

@Component({
  standalone: true,
  selector: 'app-nav-right',
  imports: [RouterModule, SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit, OnDestroy {
  nombreUsuario = '';
  conteo = 0;
  private intervalId: ReturnType<typeof setInterval> | undefined;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    // Leer el nombre de usuario guardado tras el login
    this.nombreUsuario = localStorage.getItem('nombre_usuario') || '';
    this.EnviarConteoVentasPendientes();
    
    // Ejecutar cada 10 segundos
    this.intervalId = setInterval(() => {
      this.EnviarConteoVentasPendientes();
    }, 10000);
  }

  ngOnDestroy(): void {
    // Limpiar el intervalo cuando se destruye el componente
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  logout(): void {
    // Limpiar localStorage (puedes borrar solo lo necesario)
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('nombre_usuario');
    // Redirigir al login
    this.router.navigate(['/login']);
  }

  sincronizarDatos(): void {
    Swal.fire({
      title: 'Sincronizando...',
      text: 'Por favor espera mientras se sincronizan los datos.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    fetch('https://aslsoft.dev/clientes/nudito/sincronizar_odoo.php')
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          Swal.fire('¡Sincronización exitosa!', '', 'success');
        } else {
          Swal.fire('Error al sincronizar', data.message, 'error');
        }
      })
      .catch(error => {
        Swal.fire('Error de red al sincronizar', error.message, 'error');
      })
  }

  enviarVentas(): void {
    Swal.fire({
      title: 'Enviando Ventas',
      text: 'Por favor espera mientras se envían las ventas.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    fetch('https://aslsoft.dev/clientes/nudito/enviar_ventas_odoo.php')
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        Swal.fire('¡Ventas enviadas exitosamente!', '', 'success');
      } else {
        Swal.fire('Error al enviar ventas', data.message, 'error');
      }
    })
  }

  EnviarConteoVentasPendientes(): void {
    this.http.post<MensajeConteoVentasPendientes>(API_ENDPOINTS.conteoVentasPendientesOdoo, {}).subscribe({
      next: (response) => {
        if (response.status) {
          this.conteo = response.count;
        } else {
          Swal.fire('Error', 'No se pudo obtener el conteo de ventas pendientes', 'error');
        }
      }
    })
  }
}

// Importaciones necesarias de Angular, módulos y librerías externas
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { API_ENDPOINTS } from 'src/app/core/config/constants';
import { EstadoBadgePipe } from 'src/app/shared/pipes/estadoClase.pipe';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


// Definición de la interfaz Vendedor para tipar los datos de usuario
interface Vendedor {
  id_usuario:         number;
  nombre_usuario:     string;
  telefono_celular:   string;
  ubicacion_almacen?: number;
  diario?:            number;
  cliente?:           number;
  usuario:            string;
  correo_electronico: string;
  numero_celular:     string;
  nombre_rol:         string;
  nombre_estado:      string;
  estado_actual:      number;
  nombre_ubicacion?:  string;
  nombre_diario?:     string;
  nombre_cliente?:    string;
}

// Decorador que define el componente Angular
@Component({
  selector: 'app-usuarios', // Nombre del selector para usar el componente
  standalone: true, // Permite que el componente sea independiente
  templateUrl: './usuarios.component.html', // Ruta de la plantilla HTML
  styleUrls: ['./usuarios.component.scss'], // Ruta de los estilos
  imports: [CommonModule, RouterModule, FormsModule] // Módulos importados
 // Módulos importados
})
export class UsuariosComponent implements OnInit {
  vendedores: Vendedor[] = []; // Lista de vendedores obtenidos del backend
  cargando = true; // Bandera para mostrar estado de carga
  soloActivos = true; // Bandera para filtrar solo usuarios activos (no se usa en el código mostrado)
  busqueda = ''; // Texto de búsqueda para filtrar usuarios
  usuarioId = +(localStorage.getItem('id_usuario') || 0); // ID del usuario actual, obtenido del localStorage

  constructor(private http: HttpClient) {} // Inyección del servicio HttpClient

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.obtenerVendedores(); // Llama a la función para cargar los vendedores
  }

  // Obtiene la lista de vendedores desde el backend
  obtenerVendedores(): void {
    this.cargando = true; // Activa el indicador de carga
    this.http.post<any>(API_ENDPOINTS.obtenerVendedores, {}).subscribe({
      next: (response) => {
        // Si la respuesta es exitosa, asigna los vendedores; si no, asigna un array vacío
        this.vendedores = response.status ? response.vendedores : [];
        this.cargando = false; // Desactiva el indicador de carga
      },
      error: () => {
        // Si hay error, asigna un array vacío y desactiva el indicador de carga
        this.vendedores = [];
        this.cargando = false;
      }
    });
  }

  // Getter que filtra la lista de vendedores según el texto de búsqueda
  get vendedor(): Vendedor[] {
    const q = this.busqueda.trim().toLowerCase(); // Normaliza el texto de búsqueda
    return q
      ? this.vendedores.filter(u =>
          u.nombre_usuario.toLowerCase().includes(q) // Filtra por nombre de usuario
        )
      : [...this.vendedores]; // Si no hay búsqueda, retorna todos los vendedores
  }

  // Método para manejar la búsqueda (no es necesario porque el getter ya filtra)
  onBuscar(): void {
    // No es necesario, el getter hace el filtro automáticamente
  }

  // Cambia el estado (activo/archivado) de un usuario
  cambiarEstado(u: Vendedor): void {
    const esArchivado = u.estado_actual === 3; // Verifica si el usuario está archivado
    const accion = esArchivado ? 'activar' : 'archivar'; // Determina la acción a realizar

    // Muestra un cuadro de diálogo de confirmación usando SweetAlert2
    Swal.fire({
      title: `¿Deseas ${accion} este usuario?`,
      text: `Usuario: ${u.nombre_usuario}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        // Si el usuario confirma, realiza la petición para cambiar el estado
        this.http.post<any>(API_ENDPOINTS.obtenerVendedores, {}).subscribe({
          next: resp => {
            if (resp.status) {
              this.obtenerVendedores(); // Si es exitoso, recarga la lista de vendedores
            } else {
              Swal.fire('Error', resp.mensaje, 'error'); // Muestra error si la respuesta no es exitosa
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
// src/app/pages/usuarios/usuario-form/usuario-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from 'src/app/core/config/constants';
import { FormFieldComponent } from 'src/app/shared/components/form-field/form-field.component';

interface ConsultaVendedorResponse {
  status: boolean;
  mensaje?: string;
  usuario: Vendedor[];
}

interface Vendedor {
  id_usuario:         number;
  nombre_usuario:     string;
  telefono_celular:   string;
  cumpleanos:         string;
  departamento:       number;
  puesto_trabajo:     number;
  ubicacion_almacen:  number;
  cliente:            number;
}

interface ConsultaDiarios{
  status: boolean;
  mensaje?: string;
  diarios: Diario[];
}

interface Diario {
  id_diario: number;
  id_odoo: number;
  nombre_diario: string;
  eliminado: boolean;
}

interface ConsultarClientesResponse {
  status: boolean;
  mensaje?: string;
  clientes: Clientes[];
}

interface Clientes {
  id_cliente: number;
  nombre_cliente: string;
  email: string;
  telefono: string;
  calle: string;
  ciudad: string;
  latitud?: number;
  longitud?: number;
  pais: string;
  comentarios: string;
  linea_credito: number;
}

interface UbicacionAlmacenes {
  status: boolean;
  mensaje?: string;
  ubicaciones: Almacen[];
}

interface Almacen {
  id_ubicacion: number;
  id_odoo: number;
  nombre_ubicacion: string;
  eliminado: boolean;
}

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormFieldComponent
  ],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss']
})
export class UsuarioFormComponent implements OnInit {
  form!: FormGroup;
  cargando = false;
  esEdicion = false;
  usuarioId = +(localStorage.getItem('id_usuario') || 0);
  idUsuario = 0;

  permisosSeleccionados = new Set<number>();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  
  ngOnInit(): void {
    this.form = this.fb.group({
      nombre_usuario:     ['', Validators.required],
      numero_celular:     [''],
      rol:                [null, Validators.required],
      contrasena:         [''],
      diario:             ["", Validators.required],
      cliente:            ["", Validators.required],
      ubicacion_almacen:  ["", Validators.required]
    });

      // Obtener el id de la ruta si existe
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.idUsuario = +id;
      this.esEdicion = true;
      this.cargarUsuario(this.idUsuario);
    }
  });

  this.obtenerDiarios();
  this.obtenerClientes();
  this.obtenerUbicacionAlamacenes();

  }

  private cargarUsuario(id: number): void {
    this.cargando = true;
    const body = {
      action:     'obtener_usuario',
      id_usuario: id,
      usuario:    this.usuarioId
    };
    this.http.post<ConsultaVendedorResponse>(`${API_ENDPOINTS.obtenerVendedor}?id_usuario=${this.idUsuario}`, body).subscribe({
      next: response => {
        this.cargando = false;
        if (response.status && response.usuario.length > 0) {
          const vendedor = response.usuario[0];
          this.form.patchValue({
            nombre_usuario:      vendedor.nombre_usuario,
            numero_celular:     vendedor.telefono_celular,
            cumpleanos:         vendedor.cumpleanos,
            departamento:       vendedor.departamento,
            puesto_trabajo:     vendedor.puesto_trabajo,
            ubicacion_almacen:  vendedor.ubicacion_almacen,
            cliente:            vendedor.cliente
          });
        } else {
          Swal.fire('Error', response.mensaje || 'Error al cargar el usuario', 'error');
        }
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudo cargar el usuario.', 'error');
      }
    });
  }

  diarios: Diario[] = [];

  obtenerDiarios(): void {
    this.http.post<ConsultaDiarios>(API_ENDPOINTS.obtenerDiarios, {}).subscribe({
      next: response => {
        if (response.status) {
          this.diarios = response.diarios.map(d => ({
            ...d,
            eliminado: Boolean(Number(d.eliminado))
          }));
        } else {
          Swal.fire('Error', response.mensaje || 'Error al cargar los diarios', 'error');
        }
      }
    });
  }

  clientes: Clientes[] = [];
  obtenerClientes(): void {
    this.http.post<ConsultarClientesResponse>(API_ENDPOINTS.obtenerClientes, {}).subscribe({
      next: response => {
        if (response.status) {
          this.clientes = response.clientes.map(c => ({
            ...c,
          }));
        } else {
          Swal.fire('Error', response.mensaje || 'Error al cargar los clientes', 'error');
        }
      }
    });
  }

  ubicacion_almacen: Almacen[] = [];
  obtenerUbicacionAlamacenes(): void {
    this.http.post<UbicacionAlmacenes>(API_ENDPOINTS.obtenerUbicacionAlmacenes, {}). subscribe({
      next: response => {
        if (response.status) {
          this.ubicacion_almacen = response.ubicaciones.map(ua => ({
            ...ua,
            eliminado: Boolean(Number(ua.eliminado))
          }));
        }
        else {
          Swal.fire('Error', response.mensaje || 'Error al cargar las ubicaciones de almacenes', 'error');
        }
      }
    })
  }


  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando = true;
    const payload = {
      action:           'guardar_usuario',
      id_usuario:       this.idUsuario,
      usuario:          this.usuarioId,
      nombre_usuario:   this.form.value.nombre_usuario,
      usuario_valor:    this.form.value.usuario_valor,
      correo_electronico: this.form.value.correo_electronico,
      numero_celular:     this.form.value.numero_celular,
      rol:                this.form.value.rol,
      contrasena:         this.form.value.contrasena || '',
      estado_actual:      2,
      permisos_modulos:   Array.from(this.permisosSeleccionados)
    };
    this.http.post<any>(API_ENDPOINTS.obtenerClientes, payload).subscribe({
      next: response => {
        this.cargando = false;
        if (response.status) {
          Swal.fire('Éxito', response.mensaje || 'Usuario guardado correctamente', 'success')
            .then(() => this.router.navigate(['/usuarios']));
        } else {
          Swal.fire('Error', response.mensaje || 'Error al guardar el usuario', 'error');
        }
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudo guardar el usuario.', 'error');
      }
    });
  }
}

// src/app/pages/usuarios/usuario-form/usuario-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from 'src/app/core/config/constants';
import { FormFieldComponent } from 'src/app/shared/components/form-field/form-field.component';


import { ConsultaVendedorResponse } from 'src/app/core/models/vendedor.model';
import { ConsultaDiarios, Diario } from 'src/app/core/models/diarios.model';
import { ConsultarClientesResponse, Clientes } from 'src/app/core/models/clientes.model';
import { UbicacionAlmacenes, Almacen } from 'src/app/core/models/almacenes.model';

interface ActualizarVendedorResponse {
  status: boolean;
  message?: string;
}

interface ActualizarVendedorPayload {
  id_usuario: number;
  ubicacion_almacen?: number;
  diario?: number;
  cliente?: number;
  contrasena?: string;
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
            nombre_usuario:     vendedor.nombre_usuario,
            numero_celular:     vendedor.telefono_celular,
            cumpleanos:         vendedor.cumpleanos,
            diario:             vendedor.diario,
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

 guardarusuario(): void {
  const payload: ActualizarVendedorPayload = {
    id_usuario: this.idUsuario,
  };

  if (this.form.value.ubicacion_almacen) payload.ubicacion_almacen = this.form.value.ubicacion_almacen;
  if (this.form.value.diario) payload.diario = this.form.value.diario;
  if (this.form.value.cliente) payload.cliente = this.form.value.cliente;
  if (this.form.value.contrasena) payload.contrasena = this.form.value.contrasena;

  this.http.post<ActualizarVendedorResponse>(API_ENDPOINTS.actualizarVendedor, payload).subscribe({
    next: response => {
      if (response.status) {
        Swal.fire('Éxito', response.message || 'Usuario actualizado correctamente', 'success');
      } else {
        Swal.fire('Error', response.message || 'Error al actualizar el usuario', 'error');
      }
    },
    error: () => {
      Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
    }
  })
 }
}

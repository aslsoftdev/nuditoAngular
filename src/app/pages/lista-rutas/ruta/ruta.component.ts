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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { Clientes, ConsultarClientesResponse } from 'src/app/core/models/clientes.model';

declare var bootstrap: any;

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
  selector: 'app-ruta',
  standalone: true,
  imports: [CommonModule, FormsModule, FiltroVisitasPipe, NgSelectModule],
  templateUrl: './ruta.component.html',
  styleUrls: ['./ruta.component.scss']
})
export class ListaRutasFormComponent implements OnInit {
  esEdicion = false;
  cargando = false;
  ruta?: Ruta;
  busqueda: string = '';
  clasificaciones: any[] = [];
  productosInventario: any[] = [];
  visitaSeleccionada: any = null;
  mapaUrl: SafeResourceUrl | null = null;
  usuarioId = +(localStorage.getItem('id_usuario') || '0');
  ventaSeleccionada: any = { cliente: null, detalles: [] };
  ventaBackup: any = { cliente: null, detalles: [] };
  productosInventarioCliente: any[] = [];       // inventario filtrado por cliente
  clientes: Clientes[] = [];

  filtros = {
    cliente: '',
    clasificacion: '',
    metodo: ''
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.esEdicion = true;
        this.cargarClientes();
        this.cargarRuta(+id);
        this.cargarClasificaciones();
      }
    });
  }

  private cargarClasificaciones(): void {
    this.http.get<any[]>(API_ENDPOINTS.obtenerClasificaciones).subscribe({
      next: (response) => {
        if ((response as any).status) {
          this.clasificaciones = (response as any).clasificaciones;
        } else {
          this.clasificaciones = response;
        }

        this.clasificaciones.push({
          id_clasificacion: 999,          // usa un id único que no choque con los reales
          nombre_clasificacion: 'No Visitado',
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las clasificaciones', 'error');
      }
    });
  }

  private cargarInventario(idUsuario: number): void {
    this.http.get<any>(`${API_ENDPOINTS.obtenerProductos}?id_usuario=${idUsuario}`).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.productosInventario = resp.productos
            .filter((p: any) => p.stock?.existencia_inicial > 0)
            .map((p: any) => {
           
              if (this.ruta?.estado_actual === 'Terminada') {
                p.stock.existencia_real = p.stock.existencia_final;
              }
              return p;
            });
        } else {
          Swal.fire('Aviso', 'No se encontraron productos para este vendedor', 'info');
        }
      },
      error: () => {
        Swal.fire('Error', 'No se pudo obtener el inventario', 'error');
      }
    });
  }

  private cargarRuta(id: number): void {
    this.cargando = true;
    this.http.post<RutaPorid>(`${API_ENDPOINTS.obtenerRutasPorId}?id_ruta=${id}`, {}).subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.status) {
          this.ruta = response.ruta as unknown as Ruta;
          this.ruta.dinero_entregado = this.ruta.dinero_entregado || {
            total_efectivo: 0,
            total_transferencias: 0,
            total_faltante: 0
          };

          if (this.ruta.estado_actual === 'Terminada') {
            if (this.ruta.dinero_entregado.total_efectivo === 0) {
              this.ruta.dinero_entregado.total_efectivo = null as any;
            }
            if (this.ruta.dinero_entregado.total_transferencias === 0) {
              this.ruta.dinero_entregado.total_transferencias = null as any;
            }
          }
          
          // 👉 si la ruta no está cerrada, obtener inventario
          if (this.ruta.estado_actual !== 'Cerrada') {
            this.cargarInventario(this.ruta.usuario);
          }

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

  private cargarClientes(): void {
    this.http.get<ConsultarClientesResponse>(API_ENDPOINTS.obtenerClientes).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.clientes = resp.clientes;
        } else {
          Swal.fire('Aviso', resp.mensaje || 'No se encontraron clientes', 'info');
        }
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los clientes', 'error');
      }
    });
  }
  calcularTotal(visita: Visita): number {
    if (!visita.ventas) return 0;
    return visita.ventas.reduce((s, v) => s + (v.total || 0), 0);
  }

  get totalVentasFiltradas(): number {
    return this.visitasFiltradas.reduce((acc, v) => acc + (v.ventas[0]?.total || 0), 0);
  }

  get totalPagosCreditos(): number {
    return this.visitasFiltradas.reduce(
      (acc, v) => acc + (v.total_pagos_creditos || 0),
      0
    );
  }

  get visitasFiltradas() {
    return this.ruta.visitas.filter(v => {
      const coincideCliente = v.nombre_cliente.toLowerCase().includes(this.filtros.cliente.toLowerCase());
      const coincideClasificacion = !this.filtros.clasificacion || v.nombre_clasificacion === this.filtros.clasificacion;
      const coincideMetodo = !this.filtros.metodo || v.ventas[0]?.pagos[0]?.metodo_pago === this.filtros.metodo;
      return coincideCliente && coincideClasificacion && coincideMetodo;
    });
  }
  
  onImgError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = 'assets/images/no_img.jpg';
  }

  get faltanteCalculado(): number {
    if (!this.ruta) return 0;

    // 👉 Si la ruta ya está cerrada o en proceso, uso el valor guardado
    if (this.ruta.estado_actual !== 'Terminada') {
      return this.ruta.dinero_entregado?.total_faltante || 0;
    }

    // 👉 Si está terminada, calculo en tiempo real
    let faltante = 0;

    this.productosInventario?.forEach(p => {
      const final = p.stock?.existencia_final || 0;
      const real = p.stock?.existencia_real ?? final;
      const diferencia = final - real;

      if (diferencia > 0) {
        faltante += diferencia * (p.precio || 0);
      }
    });

    // también lo actualizo en el objeto para mantener sincronía
    this.ruta.dinero_entregado.total_faltante = faltante;

    return faltante;
  }


  cerrarRuta(): void {
    if (!this.ruta) return;

    Swal.fire({
      title: '¿Cerrar ruta?',
      text: 'Una vez cerrada ya no podrás modificar los datos de la ruta.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesarCierreRuta();
      }
    });
  }

  private procesarCierreRuta(): void {
    if (!this.ruta) return;

    const efectivo = this.ruta.dinero_entregado.total_efectivo;
    const transferencias = this.ruta.dinero_entregado.total_transferencias;

   if (efectivo === null || efectivo === undefined || isNaN(efectivo)) {
      Swal.fire('Aviso', 'Debes capturar el efectivo entregado por el agente', 'warning');
      return;
    }

    if (transferencias === null || transferencias === undefined || isNaN(transferencias)) {
      Swal.fire('Aviso', 'Debes capturar las transferencias entregadas por el agente', 'warning');
      return;
    }


    // 👉 Validar inventario
    if (!this.productosInventario || this.productosInventario.length === 0) {
      Swal.fire('Aviso', 'No hay inventario para calcular faltante', 'info');
      return;
    }

    // 👉 Calcular faltante
    let faltante = 0;
    this.productosInventario.forEach(p => {
      const final = p.stock?.existencia_final || 0;
      const real = p.stock?.existencia_real || 0;
      const diferencia = final - real;
      if (diferencia > 0) {
        faltante += diferencia * (p.precio || 0);
      }
    });

    // 👉 Guardar en la ruta
    this.ruta.dinero_entregado.total_faltante = faltante;

    // 👉 Preparar existencias para mandar al backend
    const existencias = this.productosInventario.map(p => {
      const final = p.stock?.existencia_final || 0;
      const real = p.stock?.existencia_real || 0;

      return {
        producto: p.id_producto,
        existencia_inicial: p.stock?.existencia_inicial || 0,
        total_vendido: p.stock?.total_vendido || 0,
        total_devoluciones: p.stock?.total_devoluciones || 0,
        existencia_final: final,
        existencia_real: real,
        diferencia: final - real,
        regresar_almacen: 0
      };
    });

    // 👉 Consumir API de cerrar ruta
    const payload = {
      id_usuario: this.ruta.usuario,
      id_ruta: this.ruta.id_ruta,
      json_dinero_entregado: {
        total_efectivo: efectivo,
        total_transferencias: transferencias,
        total_faltante: faltante
      },
      json_existencias: existencias
    };

    this.http.post(`${API_ENDPOINTS.cerrarRuta}`, payload).subscribe({
      next: (resp: any) => {
        if (resp.status) {
          Swal.fire(
            'Ruta Cerrada',
            `El faltante calculado es ${faltante.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`,
            'success'
          );
          
          this.cargarRuta(this.ruta.id_ruta);
        } else {
          Swal.fire('Error', resp.message || 'No se pudo cerrar la ruta', 'error');
        }
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cerrar la ruta', 'error');
      }
    });
  }

  verUbicacion(visita: any): void {
    this.visitaSeleccionada = visita;

    const url = `https://www.google.com/maps?q=${visita.latitud},${visita.longitud}&output=embed`;
    this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    const modal = new bootstrap.Modal(document.getElementById('modalUbicacion'));
    modal.show();
  }

  cancelarVisita(visita: any): void {
    Swal.fire({
      title: '¿Cancelar visita?',
      text: `Se cancelará la visita #${visita.id_visita} del cliente ${visita.nombre_cliente}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(API_ENDPOINTS.cancelarVisita, {
          id_usuario: this.usuarioId, 
          id_visita: visita.id_visita,
          vendedor: visita.vendedor
        }).subscribe({
          next: (resp: any) => {
            if (resp.status) {
              Swal.fire('Cancelada', resp.message || 'La visita fue cancelada con éxito', 'success');
              this.cargarRuta(this.ruta.id_ruta);
            } else {
              Swal.fire('Error', resp.message || 'No se pudo cancelar la visita', 'error');
            }
          },
          error: () => {
            Swal.fire('Error', 'No se pudo cancelar la visita', 'error');
          }
        });
      }
    });
  }

  verVenta(visita: any): void {
    if (visita.ventas && visita.ventas.length > 0) {
      this.ventaSeleccionada = JSON.parse(JSON.stringify(visita.ventas[0]));
      this.ventaBackup = JSON.parse(JSON.stringify(visita.ventas[0]));
    } else {
      this.ventaSeleccionada = { detalles: [] };
      this.ventaBackup = { detalles: [] };
    }

    this.ventaSeleccionada.visita = visita.id_visita || this.ventaSeleccionada.visita?.id_visita || null;
    this.ventaSeleccionada.cliente = visita.cliente || this.ventaSeleccionada.cliente?.id_cliente || null;

    this.cargando = true;

    this.cargarInventarioConCliente(this.ventaSeleccionada.cliente).add(() => {
      this.cargando = false;

      const modal = new (window as any).bootstrap.Modal(
        document.getElementById('ventaModal')
      );
      modal.show();
    });
  }

  private cargarInventarioConCliente(idCliente: number) {
    console.log(`${API_ENDPOINTS.obtenerProductos}?id_usuario=${this.usuarioId}&id_cliente=${idCliente}`);
    
    return this.http
      .get<any>(`${API_ENDPOINTS.obtenerProductos}?id_usuario=${this.usuarioId}&id_cliente=${idCliente}`)
      .subscribe({
        next: (resp) => {
           if (resp.status) {
              this.productosInventarioCliente = resp.productos
                .filter((p: any) => p.stock?.existencia_inicial > 0)
                .map((p: any) => {
                  if (this.ruta?.estado_actual === 'Terminada') {
                    p.stock.existencia_real = p.stock.existencia_final;
                  }
                  return p;
                });
            } else {
              Swal.fire('Aviso', 'No se encontraron productos para este cliente', 'info');
            }
        },
        error: () => {
          Swal.fire('Error', 'No se pudo obtener el inventario para el cliente', 'error');
        }
      });
  }

  cancelarCambios(): void {
    // Restaurar desde backup
    this.ventaSeleccionada = JSON.parse(JSON.stringify(this.ventaBackup));
  }

  guardarCambios(): void {
    if (!this.ventaSeleccionada) return;

    console.log(this.ventaSeleccionada);
    const payload = {
      id_visita: this.ventaSeleccionada.visita,      // id de la visita
      id_cliente: this.ventaSeleccionada.cliente,    // cliente seleccionado
      venta: {
        id_venta: this.ventaSeleccionada.id_venta,
        subtotal: this.ventaSeleccionada.subtotal || 0,
        iva: this.ventaSeleccionada.iva || 0,
        ieps: this.ventaSeleccionada.ieps || 0,
        total_transferencia: this.ventaSeleccionada.total_transferencia || 0,
        total_tarjeta: this.ventaSeleccionada.total_tarjeta || 0,
        total_efectivo: this.ventaSeleccionada.total_efectivo || 0,
        total_credito: this.ventaSeleccionada.total_credito || 0,
        cambio: this.ventaSeleccionada.cambio || 0,
        total: this.granTotal,
        moneda: 'MXN',
        detalles: this.ventaSeleccionada.detalles
      },
      pagos: this.ventaSeleccionada.pagos || []
    };

    this.http.post(API_ENDPOINTS.cambiarVisita, payload).subscribe({
      next: (resp: any) => {
        if (resp.status) {
          Swal.fire('Éxito', 'Venta actualizada con éxito', 'success');
          this.cargarRuta(this.ruta.id_ruta); // refrescar ruta
        } else {
          Swal.fire('Error', resp.message || 'No se pudo actualizar la venta', 'error');
        }
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar la venta', 'error');
      }
    });
  }

  onProductoChange(detalle: any): void {
    const prod = this.productosInventarioCliente.find(
      p => p.id_producto == detalle.producto // 👈 doble igual para comparar string/number
    );

    if (prod) {
      detalle.nombre_producto = prod.nombre_producto;
      detalle.precio_unitario = Number(prod.precio) || 0;
      detalle.cantidad = detalle.cantidad || 1;
      this.recalcularDetalle(detalle);
    } else {
      // Si no encuentra producto, asegúrate de reiniciar
      detalle.precio_unitario = 0;
      detalle.total = 0;
    }
  }

  recalcularDetalle(detalle: any): void {
    detalle.total = (detalle.cantidad || 0) * (detalle.precio_unitario || 0);

    // Recalcular total general
    this.ventaSeleccionada.total = this.ventaSeleccionada.detalles
      .reduce((acc: number, d: any) => acc + (d.total || 0), 0);
  }

  eliminarDetalle(index: number): void {
    this.ventaSeleccionada.detalles.splice(index, 1);
    this.ventaSeleccionada.total = this.ventaSeleccionada.detalles
      .reduce((acc: number, d: any) => acc + (d.total || 0), 0);
  }

  agregarDetalle(): void {
    this.ventaSeleccionada.detalles.push({
      id_detalle: null,
      venta: this.ventaSeleccionada.id_venta,
      producto: null,
      nombre_producto: '',
      cantidad: 1,
      precio_unitario: 0,
      total: 0
    });
  }

  get granTotal(): number {
    if (!this.ventaSeleccionada?.detalles) return 0;
    return this.ventaSeleccionada.detalles.reduce(
      (acc: number, d: any) => acc + (d.total || 0),
      0
    );
  }
}

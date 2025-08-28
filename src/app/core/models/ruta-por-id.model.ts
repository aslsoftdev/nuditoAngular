export interface RutaPorid {
  status: boolean;
  message?: string;
  route: Ruta;   // 👈 aquí ya no es Ruta[]
}

export interface Ruta {
  nombre_usuario: string;
  fecha_inicio: string;
  fecha_fin: string;
  total_faltante: number;   // 👈 lo tenías como total_faltantes
  json_dinero_entregado: string;
  json_existencias: string;
  estado_actual: string;
  total_efectivo: number;
  total_tarjeta: number;
  total_transferencias: number; // 👈 ojo, tu API manda en plural
  total_credito: number;
  duracion: string;

  // Relacionados
  detalles: DetalleRuta[];
  visitas: Visita[];
}

export interface DetalleRuta {
  id_detalle_ruta: number;
  ruta: number;
  producto: number;
  existencia_inicial: number;
  ventas: number;
  devoluciones: number;
  existencia_real: number;
  diferencia: number;
  regreso: number;
  nombre_producto: string;
}

export interface Visita {
  id_visita: number;
  cliente: number;
  clasificacion_visita: number;
  fecha_registro: string;
  nombre_cliente: string;
  nombre_clasificacion: string;
  ventas: Venta[];
}

export interface Venta {
  id_venta: number;
  visita: number;
  subtotal: number;
  iva: number;
  total: number;
  total_tarjeta: number;
  total_efectivo: number;
  cambio: number;
  detalles: DetalleVenta[];
  pagos: Pago[];
}

export interface DetalleVenta {
  id_detalle: number;
  venta: number;
  producto: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  iva: number;
  ieps: number;
  total: number;
}

export interface Pago {
  id_pago: number;
  venta: number;
  metodo_pago: string;
  importe: number;
}

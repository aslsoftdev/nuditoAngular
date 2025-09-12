export interface RutaPorid {
  status: boolean;
  message?: string;
  ruta: Ruta;
}

export interface Ruta {
  // Identificadores
  id_ruta: number;
  usuario: number;
  cerrada_por: number;
  eliminado: number;

  // Datos generales
  nombre_usuario: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  fecha_cerrada: string | null;
  estado_actual: string;
  duracion: string;

  // Totales de dinero
  total_efectivo: number;
  total_tarjeta: number;
  total_transferencias: number;
  total_credito: number;
  total_faltante: number;

  total_pagos_creditos_efectivo: number;
  total_pagos_creditos_tarjeta: number;
  total_pagos_creditos_transferencias: number;

  // Campos JSON que pueden llegar como objeto o string
  json_dinero_entregado: DineroEntregado | string;
  json_existencias: Existencia[] | string;

  // Relaciones
  detalles: DetalleRuta[];
  visitas: Visita[];
}

export interface DineroEntregado {
  total_efectivo: number;
  total_transferencias: number;
  total_faltante: number;
  total_sobrante?: number; // opcional, por si se usa en el futuro
}

export interface Existencia {
  producto: number;
  existencia_inicial: number;
  total_vendido: number;
  existencia_final: number;
  existencia_real: number;
  diferencia: number;
  regresar_almacen: number;
  total_devoluciones: number;
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
  estado_actual: number;
  eliminado: number;
  nombre_producto: string;
}

export interface Visita {
  id_visita: number;
  cliente: number;
  clasificacion_visita: number;
  fecha_registro: string;
  fecha_cancelacion?: string | null;
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

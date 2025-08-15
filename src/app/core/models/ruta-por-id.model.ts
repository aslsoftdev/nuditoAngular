export interface RutaPorid {
  status: boolean;
  message?: string;
  route: Ruta[];
}

export interface Ruta {
  nombre_usuario: string;
  fecha_inicio: string;
  fecha_fin: string;
  total_faltantes: number;
  json_dinero_entregado: string;
  json_existencias: string;
  estado_actual: string;
  total_efectivo: number;
  total_tarjeta: number;
  total_transferencia: number;
  total_credito: number;
  
}
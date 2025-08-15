export interface RutasResponse {
  status: boolean;
  rutas: Ruta[];
}

export interface Ruta {
  nombre_usuario: string;
  id_ruta: number;
  usuario: number;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_cerrada: string;
  total_faltante: number;
  json_dinero_entregado: string;
  json_existencias: string;
  cerrapada_por: number;
  estado_actual: string;
  eliminado: boolean;
}
export interface ConsultarClientesResponse {
  status: boolean;
  mensaje?: string;
  clientes: Clientes[];
}

export interface Clientes {
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
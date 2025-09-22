export interface ConsultarKpisResponse {
  status: boolean;
  fecha: string;
  kpis: {
    clientes_planeados: number;
    clientes_visitados: number;
    clientes_cerrados: number;
    clientes_faltan: number;
    total_efectivo: number;
    total_transferencias: number;
    total_credito: number;
  };
}

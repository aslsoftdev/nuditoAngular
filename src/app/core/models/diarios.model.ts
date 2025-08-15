export interface ConsultaDiarios{
  status: boolean;
  mensaje?: string;
  diarios: Diario[];
}

export interface Diario {
  id_diario: number;
  id_odoo: number;
  nombre_diario: string;
  eliminado: boolean;
}
export interface UbicacionAlmacenes {
  status: boolean;
  mensaje?: string;
  ubicaciones: Almacen[];
}

export interface Almacen {
  id_ubicacion: number;
  id_odoo: number;
  nombre_ubicacion: string;
  eliminado: boolean;
}
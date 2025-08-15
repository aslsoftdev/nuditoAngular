export interface ConsultaVendedorResponse {
  status: boolean;
  mensaje?: string;
  usuario: Vendedor[];
}

interface Vendedor {
  id_usuario:         number;
  nombre_usuario:     string;
  telefono_celular:   string;
  cumpleanos:         string;
  diario:             number;
  departamento:       number;
  puesto_trabajo:     number;
  ubicacion_almacen:  number;
  cliente:            number;
}
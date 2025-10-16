export interface SolicitudFacturaresponse{
    status: boolean;
    solicitudes_factura: SolicitudFactura[];
    mensaje?: string;
}

export interface SolicitudFactura{
    id_solicitud: number;
    venta: number;
    facturada: number;
    fecha_facturada: string;
    comentarios: string;
    activa: number;
    total: number;
    id_odoo: number;
    nombre_cliente: string;
    estado_actual: number;
}

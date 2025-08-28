import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterVisitas',
  standalone: true
})
export class FilterVisitasPipe implements PipeTransform {
  transform(visitas: any[], search: string): any[] {
    if (!visitas || !search) return visitas;
    search = search.toLowerCase();

    return visitas.filter(v =>
      v.nombre_cliente?.toLowerCase().includes(search) ||
      v.nombre_clasificacion?.toLowerCase().includes(search) ||
      v.ventas[0]?.pagos[0]?.metodo_pago?.toLowerCase().includes(search)
    );
  }
}

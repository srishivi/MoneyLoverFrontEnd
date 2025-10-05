import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'replaceComma', standalone: true })
export class ReplaceCommaPipe implements PipeTransform {
  transform(value: string): number {
    if (!value) return 0;
    // Remove commas and convert to number
    return parseFloat(value.replace(/,/g, ''));
  }
}

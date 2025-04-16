import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 25, trail = '...'): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}

/*
EJEMPLO DE USO:

import { Component } from '@angular/core';
import { TruncatePipe } from 'src/app/shared/pipes/truncate.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sample',
  standalone: true,
  imports: [CommonModule, TruncatePipe],
  template: `
    <p>{{ longText | truncate:10:'...' }}</p>
  `
})
export class SampleComponent {
  longText = 'Esta es una frase muy larga que será truncada';
}

*/
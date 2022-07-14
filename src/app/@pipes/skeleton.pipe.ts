import {Pipe, PipeTransform} from '@angular/core';
import {NgxSkeletonLoaderConfigTheme} from "ngx-skeleton-loader/lib/ngx-skeleton-loader-config.types";

@Pipe({
  name: 'skeleton'
})
export class SkeletonPipe implements PipeTransform {
  transform(theme: 'standard' | 'circle', height = 1.3): NgxSkeletonLoaderConfigTheme {
    switch (theme) {
      default:
      case 'standard':
        return {
          'background': 'rgba(255, 255, 255, 0.10)',
          'box-shadow': 'inset 0 0 10px rgba(0, 0, 0, 0.2)',
          'height.rem': height
        }
      case 'circle':
        return {
          'background': 'rgba(255, 255, 255, 0.10)',
          'height.px': height,
          'width.px': height,
        }
    }

    return null;
  }

}

// app.translate-loader.ts
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


export function createTranslateLoader(http: HttpClient) {
  // Asume que tendrás archivos JSON en la carpeta `assets/i18n/`
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

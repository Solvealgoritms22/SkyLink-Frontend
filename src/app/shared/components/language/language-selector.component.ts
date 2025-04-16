import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../../../core/models/language.model';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  // Definir los idiomas disponibles con su bandera (asegúrate de tener los archivos en assets/flags)
  languages: Language[] = [
    { code: 'en', label: 'English', flag: 'assets/flags/en.svg' },
    { code: 'es', label: 'Español', flag: 'assets/flags/es.svg' }
  ];

  // Idioma seleccionado
  selectedLang!: Language;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    // Revisa localStorage para ver si hay un idioma guardado
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      // Si existe, se busca en el listado. Si no se encuentra, se toma el primer idioma.
      this.selectedLang = this.languages.find(lang => lang.code === savedLang) || this.languages[0];
      // Se usa el idioma guardado
      this.translateService.use(this.selectedLang.code);
    } else {
      // Si no hay guardado, se intenta obtener del TranslateService (current o default) o se usa el primer idioma.
      const currentLang = this.translateService.currentLang || this.translateService.getDefaultLang();
      this.selectedLang = this.languages.find(lang => lang.code === currentLang) || this.languages[0];
    }
  }

  onLanguageChange() {
    // Cuando se cambia el idioma, se actualiza el TranslateService y se guarda en localStorage
    this.translateService.use(this.selectedLang.code);
    localStorage.setItem('language', this.selectedLang.code);
  }
}

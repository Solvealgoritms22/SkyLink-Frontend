import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ScrollTop } from 'primeng/scrolltop';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ScrollTop],
    template: ` <router-outlet>
        <div class="fixed z-50">
            <p-scrolltop [threshold]="100" icon="pi pi-arrow-up" [buttonProps]="{ severity: 'contrast', raised: true, rounded: true }" />
        </div>
    </router-outlet>`
})
export class AppComponent implements OnInit {
    constructor(
        private translateService: TranslateService,
    ) {}

    ngOnInit() {
        // Idioma por defecto
        this.translateService.setDefaultLang('es');
    }

    switchToEnglish() {
        this.translateService.use('en');
    }

    switchToSpanish() {
        this.translateService.use('es');
    }
}

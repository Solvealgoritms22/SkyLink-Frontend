import { Component } from '@angular/core';
import { AppConfigService } from '../../core/services/app-config.service';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        © Copyright by
        <a href="{{ configService.appUrl }}" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">{{ configService.appName }}</a>
    </div>`
})
export class AppFooter {
    constructor(
        public configService: AppConfigService
    ) {}
}

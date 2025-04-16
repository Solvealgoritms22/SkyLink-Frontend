import { Injectable, effect, signal, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { layoutConfig, LayoutState, MenuChangeEvent } from '../../core/models/layout.model';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private router = inject(Router); // Inject Router
  private http = inject(HttpClient);

  _config: layoutConfig = {
    preset: 'Aura',
    primary: 'emerald',
    surface: null,
    darkTheme: false,
    menuMode: 'static'
  };

  _state: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false
  };

  // Signals for configuration and state
  layoutConfig = signal<layoutConfig>(this._config);
  layoutState = signal<LayoutState>(this._state);

  private configUpdate = new Subject<layoutConfig>();
  private overlayOpen = new Subject<any>();
  private menuSource = new Subject<MenuChangeEvent>();
  private resetSource = new Subject();

  menuSource$ = this.menuSource.asObservable();
  resetSource$ = this.resetSource.asObservable();
  configUpdate$ = this.configUpdate.asObservable();
  overlayOpen$ = this.overlayOpen.asObservable();

  theme = computed(() => (this.layoutConfig()?.darkTheme ? 'light' : 'dark'));
  isSidebarActive = computed(() => this.layoutState().overlayMenuActive || this.layoutState().staticMenuMobileActive);
  isDarkTheme = computed(() => this.layoutConfig().darkTheme);
  getPrimary = computed(() => this.layoutConfig().primary);
  getSurface = computed(() => this.layoutConfig().surface);
  isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');
  transitionComplete = signal<boolean>(false);

  private initialized = false;
  private currentRoute: string = '/'; // Track current route

  constructor() {
    // Subscribe to router events to update currentRoute
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
        // Reapply or skip styles based on the new route
        this.applyStylesForRoute();
      });

    // Load stored configuration
    const storedConfig = localStorage.getItem('layoutConfig');
    if (storedConfig) {
      this._config = JSON.parse(storedConfig);
      this.layoutConfig.set(this._config);
    }

    effect(() => {
      const config = this.layoutConfig();
      if (config) {
        this.onConfigUpdate();
      }
    });

    effect(() => {
      const config = this.layoutConfig();
      if (!this.initialized || !config) {
        this.initialized = true;
        return;
      }
      this.handleDarkModeTransition(config);
    });
  }

  private applyStylesForRoute(): void {
    // Skip applying styles for the root route
    if (this.currentRoute === '/' || this.currentRoute === '') {
      document.documentElement.classList.remove('app-dark');
    } else {
      this.toggleDarkMode(this.layoutConfig());
    }
  }

  private handleDarkModeTransition(config: layoutConfig): void {
    // Skip dark mode transition for the root route
    if (this.currentRoute === '/' || this.currentRoute === '') {
      return;
    }

    if ((document as any).startViewTransition) {
      this.startViewTransition(config);
    } else {
      this.toggleDarkMode(config);
      this.onTransitionEnd();
    }
  }

  private startViewTransition(config: layoutConfig): void {
    const transition = (document as any).startViewTransition(() => {
      this.toggleDarkMode(config);
    });
    transition.ready
      .then(() => {
        this.onTransitionEnd();
      })
      .catch(() => {});
  }

  toggleDarkMode(config?: layoutConfig): void {
    // Skip applying dark mode for the root route
    if (this.currentRoute === '/' || this.currentRoute === '') {
      document.documentElement.classList.remove('app-dark');
      return;
    }

    const _config = config || this.layoutConfig();
    if (_config.darkTheme) {
      document.documentElement.classList.add('app-dark');
    } else {
      document.documentElement.classList.remove('app-dark');
    }
  }

  private onTransitionEnd() {
    this.transitionComplete.set(true);
    setTimeout(() => {
      this.transitionComplete.set(false);
    });
  }

  onMenuToggle() {
    if (this.isOverlay()) {
      this.layoutState.update((prev) => ({ ...prev, overlayMenuActive: !this.layoutState().overlayMenuActive }));
      if (this.layoutState().overlayMenuActive) {
        this.overlayOpen.next(null);
      }
    }
    if (this.isDesktop()) {
      this.layoutState.update((prev) => ({ ...prev, staticMenuDesktopInactive: !this.layoutState().staticMenuDesktopInactive }));
    } else {
      this.layoutState.update((prev) => ({ ...prev, staticMenuMobileActive: !this.layoutState().staticMenuMobileActive }));
      if (this.layoutState().staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  isMobile() {
    return !this.isDesktop();
  }

  onConfigUpdate() {
    const currentConfig = this.layoutConfig();
    this._config = { ...currentConfig };

    // Guardar la configuración completa en localStorage (incluyendo darkTheme)
    localStorage.setItem('layoutConfig', JSON.stringify(currentConfig));

    if (!environment.production && environment.mockLogin) {
      console.log('Mock update layout config (guardado en localStorage):', currentConfig);
      this.configUpdate.next(currentConfig);
    } else {
      const { darkTheme, ...configToSend } = currentConfig;
      this.http.put(`${environment.apiUrl}/config`, configToSend).subscribe({
        next: (response) => {
          console.log('Layout config actualizada en backend:', response);
          this.configUpdate.next(currentConfig);
        },
        error: (err) => {
          console.error('Error actualizando la layout config en backend:', err);
        }
      });
    }
  }

  onMenuStateChange(event: MenuChangeEvent) {
    this.menuSource.next(event);
  }

  reset() {
    this.resetSource.next(true);
  }
}
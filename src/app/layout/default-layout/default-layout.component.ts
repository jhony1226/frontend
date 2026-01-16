import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { AuthMockService } from '../../services/AuthMockService';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective
  ]
})
export class DefaultLayoutComponent {
  private authMockService = inject(AuthMockService);
  public navItems = this.getFilteredNavItems();

  private getFilteredNavItems() {
    if (this.authMockService.isCobrador()) {
      // Cobradores ven cambio de sucursal y registro de cobro
      return [
        {
          name: 'Cambio de Sucursal',
          url: '/cambio-sucursal',
          iconComponent: { name: 'cil-settings' },
        },
        {
          name: 'Cobros',
          url: '/cobro',
          iconComponent: { name: 'cil-bell' },
          children: [
            {
              name: 'Registro Cobro',
              url: '/cobro/crear-cobro',
              icon: 'nav-icon-bullet',
            }
          ]
        }
      ];
    }
    // Admin ve todo el menú
    return [...navItems];
  }
}

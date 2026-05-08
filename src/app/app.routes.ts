import { Routes } from '@angular/router'
import { HomeComponent } from './presentation/layout/home/home.component'

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'customers', pathMatch: 'full' },
      {
        path: 'customers',
        loadComponent: () =>
          import('./presentation/components/pages/customer-page.component')
            .then(m => m.CustomerPageComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
]
import { Routes } from '@angular/router';
import { ShellComponent } from './presentation/layout/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'clientes' },
      {
        path: 'clientes',
        loadChildren: () =>
          import('./presentation/features/clientes/clientes.routes').then(
            (m) => m.CLIENTES_ROUTES,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'clientes' },
];

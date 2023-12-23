import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisualizePermissionDeniedComponent } from './visualize-permission-denied/visualize-permission-denied.component';

const routes: Routes = [
  {
    path: '',
    component: VisualizePermissionDeniedComponent
  },
  {
    path: '**',
    redirectTo: '/authentication',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionDeniedRoutingModule { }

import { ProjectorStartPageComponent } from './projector-start-page/projector-start-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectorViewPageComponent } from './projector-view-page/projector-view-page.component';

const routes: Routes = [
  {path: 'home', component: ProjectorStartPageComponent},
  {path: 'home/:id', component: ProjectorViewPageComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true } )],
  exports: [RouterModule]
})
export class AppRoutingModule { }

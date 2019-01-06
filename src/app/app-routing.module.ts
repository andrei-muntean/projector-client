import { ProjectorStartPageComponent } from './projector-start-page/projector-start-page.component';
import { ProjectorViewPageComponent } from './projector-view-page/projector-view-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectorControlPageComponent } from './projector-control-page/projector-control-page.component';

const routes: Routes = [
  {path: 'home', component: ProjectorStartPageComponent},
  {path: 'presentation', component: ProjectorViewPageComponent},
  {path: 'control', component: ProjectorControlPageComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true } )],
  exports: [RouterModule]
})
export class AppRoutingModule { }

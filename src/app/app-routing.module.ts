import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginUsuarioComponent } from './components/login-usuario/login-usuario.component';
import { ListadoMensajesComponent } from './components/listado-mensajes/listado-mensajes.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginUsuarioComponent },
  { path: 'listadoMensajes', component: ListadoMensajesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

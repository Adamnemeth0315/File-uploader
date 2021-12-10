import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadGuard } from './guard/load.guard';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  { 
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule) 
  },
  { 
    path: 'files',
    canLoad: [LoadGuard],
    loadChildren: () => import('./modules/file-manager/file-manager.module').then(m => m.FileManagerModule) 
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

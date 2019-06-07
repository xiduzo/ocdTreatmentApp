import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPage } from '@/pages/auth/login/login';
import { TabsPage } from '@/pages/tabs/tabs';

// Routes
const routes: Routes = [
  { path: '', component: TabsPage },
  { path: 'login', component: LoginPage }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRouting {}

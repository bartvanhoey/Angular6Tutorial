import { CustomPreloadingService } from './custom-preloading.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules, NoPreloading } from '@angular/router';
import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  // redirect to the home route if the client side route path is empty
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'employees', data: { preload: true }, loadChildren: './employee/employee.module#EmployeeModule'},
  // wild card route
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {preloadingStrategy: CustomPreloadingService})
    // RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
    // RouterModule.forRoot(appRoutes, {preloadingStrategy: NoPreloading})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

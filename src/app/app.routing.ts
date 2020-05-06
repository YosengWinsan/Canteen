import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
    { path: '', redirectTo: 'canteen', pathMatch: 'full' },
    { path: 'canteen', loadChildren: 'app/canteen/canteen.module#CanteenModule' },
    { path: 'user', loadChildren: 'app/user/user.module#UserModule' }
  //{ path: '**', redirectTo: 'admin/dashboard' }
];


@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

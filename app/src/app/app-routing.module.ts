import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'

const routes: Routes = [
	{
		path: 'tasks',
		loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
	},
	{
		path: '',
		redirectTo: 'tasks',
		pathMatch: 'full',
	},
]

@NgModule({
	imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
	exports: [RouterModule],
})
export class AppRoutingModule {}

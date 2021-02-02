import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouteReuseStrategy } from '@angular/router'

import { IonicModule, IonicRouteStrategy } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'

import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'

import { HttpClient, HttpClientModule } from '@angular/common/http'
import { APP_INITIALIZER } from '@angular/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, '/assets/i18n/', '.json')
}

function AppInitializerFactory(translate: TranslateService): () => Promise<any> {
	return async (): Promise<any> => {
		const lang = translate.getBrowserLang()
		translate.setDefaultLang('nl')
		if (lang !== 'nl') {
			translate.use(lang)
		}

		return Promise.resolve()
	}
}

@NgModule({
	declarations: [AppComponent],
	entryComponents: [],
	imports: [
		BrowserModule,
		HttpClientModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient],
			},
		}),
		IonicModule.forRoot(),
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
	],
	providers: [
		StatusBar,
		SplashScreen,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{
			provide: APP_INITIALIZER,
			useFactory: AppInitializerFactory,
			multi: true,
			deps: [TranslateService],
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}

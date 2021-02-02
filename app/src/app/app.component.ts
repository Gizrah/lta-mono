import { Component } from '@angular/core'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { Platform } from '@ionic/angular'

@Component({
	selector: 'app-root',
	template: `
		<ion-app>
			<ion-router-outlet></ion-router-outlet>
		</ion-app>
	`,
	styleUrls: ['app.component.scss'],
})
export class AppComponent {
	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
	) {
		this.initializeApp()
	}

	private initializeApp(): void {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault()
			this.splashScreen.hide()
		})
	}
}

import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

declare const module: any

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: true,
	})
	const microservice = app.connectMicroservice({
		transport: Transport.TCP,
		options: {
			port: 8101,
		},
	})

	const options = new DocumentBuilder()
		.setTitle('Lyceo Test Service')
		.setDescription('Lyceo Test Service voor toevoegen en uitlezen van Tasks')
		.build()

	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api', app, document)

	await app.startAllMicroservicesAsync()
	await app.listen(8101)

	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}
}
bootstrap()

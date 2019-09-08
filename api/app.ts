import Koa from 'koa'
import KoaRouter from 'koa-router'
import KoaSession from 'koa-session'
import globby from 'globby'
import path from 'path'
import bunyan from 'bunyan'
import { Config } from './interfaces'

export class App {
	AUTOLOAD_PATHS = [
		`models/*.js`,
		`middleware/**/*.js`,
		`controllers/**/*.js`
	]
	AUTOLOAD_HOOKS = [`beforeInitialize`, `initialize`, `afterInitialize`]

	koa = new Koa()
	router = new KoaRouter()
	logger = bunyan.createLogger({
		name: 'subtekstoj.net'
	})

	constructor() {}

	async initialize(config: Config) {
		await this.autoload()
	}

	/**
	 * Function responsible of autoloading models, middleware, controllers
	 */
	private async autoload() {
		const loadedModules: any[] = []

		for (let p of this.AUTOLOAD_PATHS) {
			const files = await globby(
				path.join(__dirname, p).replace(/\\/g, '/')
			)

			for (let file of files) {
				try {
					loadedModules.push(require(file))
				} catch (err) {
					this.logger.warn({ err, file }, 'Failed to autoload file')
					console.error(err)
				}
			}
		}

		for (let hookName of this.AUTOLOAD_HOOKS) {
			for (let mod of loadedModules) {
				if (hookName in mod) {
					await Promise.resolve(mod.initialize()).catch((err) => {
						this.logger.warn(
							{ err },
							`Hook ${hookName} execution error`
						)
						console.error(err)
					})
				}
			}
		}
	}
}

export const app = new App()

import Koa from 'koa'
import KoaRouter from 'koa-router'
import koaSession from 'koa-session'
import koaBody from 'koa-body'
import koaViews from 'koa-views'
import koaMount from 'koa-mount'
import koaStatic from 'koa-static'
import globby from 'globby'
import path from 'path'
import bunyan from 'bunyan'
import { Config } from './interfaces'
import { Sequelize } from 'sequelize-typescript'

export class App {
    private AUTOLOAD_PATHS = [
        `models/*.js`,
        `components/*.js`,
        `components/*/index.js`,
        `middleware/**/*.js`,
        `controllers/**/*.js`
    ]
    private AUTOLOAD_HOOKS = [
        `beforeInitialize`,
        `initialize`,
        `afterInitialize`
    ]

    koa = new Koa()
    router = new KoaRouter()
    logger = bunyan.createLogger({
        name: 'subtekstoj.net'
    })
    config!: Config

    // Set by components/database.ts
    sequelize!: Sequelize

    private loadedModules: any[] = []

    constructor() {
        this.createServer()
    }

    async initialize(config: Config) {
        this.config = config

        await this.autoload()

        this.koa.listen(parseInt(config.PORT))
    }

    /**
     * Create the Koa server and router
     */
    private createServer() {
        this.koa.use(
            koaMount('/public', koaStatic(path.join(__dirname, 'public')))
        )
        this.koa.use(koaBody())
        this.koa.use(
            koaSession(
                {
                    maxAge: 86400000,
                    signed: false,
                    renew: true
                },
                this.koa
            )
        )
        this.koa.use(
            koaViews(path.join(__dirname, 'views'), { extension: 'pug' })
        )
        this.koa.use(this.router.routes())
        this.koa.use(this.router.allowedMethods())
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

        this.loadedModules = loadedModules

        for (let hookName of this.AUTOLOAD_HOOKS) {
            await this.executeModuleHook(hookName)
        }
    }

    private async executeModuleHook(hookName: string) {
        for (let mod of this.loadedModules) {
            if (hookName in mod) {
                await Promise.resolve(mod[hookName]()).catch(err => {
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

export const app = new App()

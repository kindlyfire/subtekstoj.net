import 'source-map-support/register'
import { Config } from './interfaces'
import { app } from './app'

const config: Config = require('dotenv').config().parsed

app.initialize(config).catch((e) => {
	console.error(e)
	process.exit(1)
})

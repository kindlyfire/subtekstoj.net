import { DbUser } from './models/User'

// Configuration as returned by dotenv. dotenv only returns strings.
export interface Config {
    // Dtabase URI for access to MySQL
    DB_URI: string

    // Port the web server will listen on
    PORT: string
}

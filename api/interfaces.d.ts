import { DbUser } from './models/User'

export interface Config {
    DB_URI: string
    PORT: string
}

interface ApiModelSettings<T> {
    getAllowedProps(inst: T, user?: DbUser): string[] | true
}

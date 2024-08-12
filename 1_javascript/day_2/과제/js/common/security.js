import { TokenController as Token } from './controllers.js'

if (!Token.exist()) {
    location.href = '/login'
}
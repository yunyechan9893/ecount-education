import { Token } from './models.js'

if (!Token.get()) {
    location.href = '/login'
}
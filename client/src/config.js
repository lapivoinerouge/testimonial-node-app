const isProduction = process.env.NODE_ENV === 'production'

export const SERVER_URL = isProduction ? '' : 'http://localhost:8000'
export const API_URL = `${SERVER_URL}/api`
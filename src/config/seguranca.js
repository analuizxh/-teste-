export const configSeguranca = {
    // Configurações JWT
    jwt: {
        segredo: process.env.JWT_SEGREDO || 'chave_secreta_forte',
        expiracao: '8h'
    },
    
    // Política de senhas
    senha: {
        tamanhoMinimo: 10,
        requerMaiuscula: true,
        requerNumero: true,
        requerSimbolo: true,
        tentativasMaximas: 5
    },
    
    // CORS
    corsOptions: {
        origin: process.env.ORIGENS_PERMITIDAS?.split(',') || [],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    
    // Rate Limiting
    rateLimiting: {
        windowMs: 15 * 60 * 1000, // 15 minutos
        maxRequests: 100
    }
};
import rateLimit from 'express-rate-limit';
import { configSeguranca } from '../config/seguranca.js';

export const limitadorGeral = rateLimit({
    windowMs: configSeguranca.rateLimiting.windowMs,
    max: configSeguranca.rateLimiting.maxRequests,
    message: 'Muitas requisições - tente novamente mais tarde',
    keyGenerator: (req) => req.headers['x-forwarded-for'] || req.ip
});

export const limitadorLogin = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: configSeguranca.senha.tentativasMaximas,
    message: 'Muitas tentativas de login - conta bloqueada temporariamente',
    skip: (req) => !req.path.includes('/api/auth/login'),
    keyGenerator: (req) => req.headers['x-forwarded-for'] || req.ip
});
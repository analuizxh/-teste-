export const sanitizarEntrada = (req, res, next) => {
    const sanitize = (value) => {
        if (typeof value === 'string') {
            return value
                .replace(/<[^>]*>?/gm, '') // Remove HTML
                .replace(/[;&<>"'`=\\/]/g, ''); // Remove caracteres especiais
        }
        return value;
    };

    // Sanitiza body
    if (req.body) {
        for (const key in req.body) {
            req.body[key] = sanitize(req.body[key]);
        }
    }
    
    // Sanitiza query params
    if (req.query) {
        for (const key in req.query) {
            req.query[key] = sanitize(req.query[key]);
        }
    }
    
    // Sanitiza route params
    if (req.params) {
        for (const key in req.params) {
            req.params[key] = sanitize(req.params[key]);
        }
    }
    
    next();
};
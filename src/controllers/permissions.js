const permissoesPorLicenca = {
    BASICA: [
        'agendamentos:leitura',
        'clientes:leitura',
        'produtos:leitura'
    ],
    PREMIUM: [
        'agendamentos:*',
        'clientes:*',
        'produtos:*',
        'funcionarios:leitura'
    ],
    ENTERPRISE: [
        '*'
    ]
};

export const checkPermission = (licenca, recurso, acao) => {
    const permissoes = permissoesPorLicenca[licenca] || [];
    
    // Verificar acesso total
    if (permissoes.includes('*')) return true;
    
    const permissaoEspecifica = `${recurso}:${acao}`;
    const permissaoGeral = `${recurso}:*`;
    
    return permissoes.includes(permissaoEspecifica) || 
           permissoes.includes(permissaoGeral);
};

// Middleware para verificar permissões
export const requirePermission = (recurso, acao) => {
    return (req, res, next) => {
        const licenca = req.licenca;
        
        if (checkPermission(licenca, recurso, acao)) {
            return next();
        }
        
        res.status(403).json({ 
            message: 'Acesso negado. Permissão insuficiente.' 
        });
    };
};
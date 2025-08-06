import prisma from '../config/prisma.js';

export const verifyLicense = async (req, res, next) => {
    const userId = req.user.id;
    
    try {
        const funcionario = await prisma.funcionario.findUnique({
            where: { id: userId },
            include: { empresa: true }
        });

        if (!funcionario || !funcionario.empresa) {
            return res.status(403).json({ message: 'Usuário não vinculado a uma empresa' });
        }

        // Verificar validade da licença
        const hoje = new Date();
        if (!funcionario.empresa.licenca || 
            (funcionario.empresa.dataExpiracaoLicenca && funcionario.empresa.dataExpiracaoLicenca < hoje)) {
            return res.status(403).json({ message: 'Licença da empresa inválida ou expirada' });
        }

        // Adiciona informações da licença à requisição
        req.licenca = funcionario.empresa.licenca;
        req.empresaId = funcionario.empresaId;
        
        next();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao verificar licença', error: error.message });
    }
};
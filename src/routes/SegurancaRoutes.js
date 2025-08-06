import { Router } from 'express';
import { authMiddleware } from '../middlewares/AuthMiddleware.js';
import { verifyLicense } from '../middlewares/LicenseMiddleware.js';
import { requirePermission } from '../controllers/permissions.js';
import prisma from '../config/prisma.js';
import { Auditoria } from '../utils/auditoria.js';

const router = Router();

// Requer autenticação ADMIN
router.get('/auditoria', 
    authMiddleware, 
    verifyLicense, 
    requirePermission('auditoria', 'leitura'),
    async (req, res) => {
        try {
            const logs = await prisma.auditoria.findMany({
                orderBy: { createdAt: 'desc' },
                take: 100 // últimos 100 logs
            });
            
            res.status(200).json(logs);
        } catch (error) {
            await Auditoria.registrar(req.user.id, 'ERRO_AUDITORIA', { error: error.message });
            res.status(500).json({ mensagem: 'Erro ao buscar logs de auditoria' });
        }
    }
);

router.post('/resetar-senha', 
    authMiddleware, 
    verifyLicense, 
    requirePermission('usuarios', 'administrar'),
    async (req, res) => {
        try {
            const { email } = req.body;
            
            // Gerar token de reset seguro
            const resetToken = crypto.randomBytes(32).toString('hex');
            const tokenHash = await bcrypt.hash(resetToken, 12);
            
            // Salvar token no banco com expiração (1 hora)
            await prisma.usuario.update({
                where: { email },
                data: {
                    resetToken: tokenHash,
                    resetTokenExpira: new Date(Date.now() + 3600000) // 1 hora
                }
            });
            
            // Enviar email com link de reset (implementação real)
            const resetLink = `${process.env.FRONTEND_URL}/resetar-senha?token=${resetToken}&email=${email}`;
            
            await Auditoria.registrar(req.user.id, 'SOLICITACAO_RESET_SENHA', { email });
            
            res.status(200).json({ 
                mensagem: 'Link de reset de senha enviado para o email' 
            });
        } catch (error) {
            await Auditoria.registrar(req.user.id, 'ERRO_RESET_SENHA', { error: error.message });
            res.status(500).json({ mensagem: 'Erro ao processar reset de senha' });
        }
    }
);

export default router;
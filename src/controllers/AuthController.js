import { SegurancaUtils } from '../utils/criptografia.js';
import { Auditoria } from '../utils/auditoria.js';
import jwt from 'jsonwebtoken';
import { configSeguranca } from '../config/seguranca.js';

export class AutenticacaoController {
  static async login(req, res) {
    const { email, senha } = req.body;
    
    try {
      // Verifica usuário
      const usuario = await prisma.usuario.findUnique({ 
        where: { email },
        include: { empresa: true }
      });
      
      if (!usuario) {
        await Auditoria.registrar(null, 'TENTATIVA_LOGIN', { email, status: 'USUARIO_INEXISTENTE' });
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }
      
      // Verifica senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        await Auditoria.registrar(usuario.id, 'TENTATIVA_LOGIN', { status: 'SENHA_INVALIDA' });
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }
      
      // Verifica se usuário está ativo
      if (!usuario.ativo) {
        await Auditoria.registrar(usuario.id, 'TENTATIVA_LOGIN', { status: 'USUARIO_INATIVO' });
        return res.status(403).json({ erro: 'Usuário desativado' });
      }
      
      // Cria token JWT
      const token = jwt.sign(
        {
          id: usuario.id,
          empresaId: usuario.empresaId,
          nivelAcesso: usuario.nivelAcesso
        },
        configSeguranca.jwt.segredo,
        { expiresIn: configSeguranca.jwt.expiracao }
      );
      
      await Auditoria.registrar(usuario.id, 'LOGIN_BEM_SUCEDIDO');
      
      res.json({ 
        token,
        expiraEm: '8h',
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          nivelAcesso: usuario.nivelAcesso
        }
      });
      
    } catch (erro) {
      await Auditoria.registrar(null, 'ERRO_LOGIN', { erro: erro.message });
      res.status(500).json({ erro: 'Falha no servidor' });
    }
  }
}
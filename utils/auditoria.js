import { PrismaClient } from '@prisma/client'; // Correct import
const prism = new PrismaClient();

export class Auditoria {
  static async registrar(usuarioId, acao, detalhes = {}) {
    try {
      await prism.auditoria.create({
        data: {
          acao,
          detalhes: JSON.stringify(detalhes),
          ip: 'IP_DO_USUARIO', // Em produção usar req.ip
          usuarioId,
          empresaid: detalhes.empresaid || null
        }  // Removed extra parenthesis
      }); // Correct closing
    } catch (error) {
      console.error('Falha ao registrar auditoria:', error);
    }
  }
}
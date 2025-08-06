import bcrypt from 'bcryptjs';
import { configSeguranca } from '../config/seguranca.js';

export class SegurancaUtils {
  static async criptografarSenha(senha) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(senha, salt);
  }

  static validarForcaSenha(senha) {
    const { tamanhoMinimo, requerMaiuscula, requerNumero, requerSimbolo } = configSeguranca.senha;
    
    if (senha.length < tamanhoMinimo) {
      return 'Senha muito curta';
    }
    
    if (requerMaiuscula && !/[A-Z]/.test(senha)) {
      return 'Requer letra maiúscula';
    }
    
    if (requerNumero && !/[0-9]/.test(senha)) {
      return 'Requer número';
    }
    
    if (requerSimbolo && !/[!@#$%^&*]/.test(senha)) {
      return 'Requer símbolo especial';
    }
    
    return null;
  }
}
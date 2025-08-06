import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';

export const createEmpresa = async (req, res) => {
  const { cnpj, razaoSocial, email, senha, telefones } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const novaEmpresa = await prisma.empresa.create({
      data: {
        cnpj,
        razaoSocial,
        email,
        senha: hashedPassword,
        telefones: {
          create: telefones || [],
        },
      },
      include: { telefones: true },
    });
    res.status(201).json(novaEmpresa);
  } catch (error) {
    if (error.code === 'P2002') {
      const campoComErro = error.meta.target.split('_')[1]; 
      return res.status(409).json({ message: `Erro: O campo '${campoComErro}' já está em uso.` });
    }
    res.status(500).json({ message: 'Erro ao criar empresa.', error: error.message });
  }
};

export const getAllEmpresas = async (req, res) => {
  try {
    const empresas = await prisma.empresa.findMany({
      include: {
        telefones: true,
        funcionarios: {
          select: { id: true, nome: true, email: true }
        }
      },
    });
    res.status(200).json(empresas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar empresas.', error: error.message });
  }
};

export const getEmpresaById = async (req, res) => {
  const { id } = req.params;
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { id: Number(id) },
      include: {
        telefones: true,
        funcionarios: true
      },
    });
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }
    res.status(200).json(empresa);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar empresa.', error: error.message });
  }
};

export const updateEmpresa = async (req, res) => {
  const { id } = req.params;
  const { razaoSocial, email, senha } = req.body;
  try {
    const empresaAtualizada = await prisma.empresa.update({
      where: { id: Number(id) },
      data: { razaoSocial, email, senha },
    });
    res.status(200).json(empresaAtualizada);
  } catch (error) {
     if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }
    res.status(500).json({ message: 'Erro ao atualizar empresa.', error: error.message });
  }
};

export const renovarLicenca = async (req, res) => {
  const { id } = req.params;
  const { tipoLicenca, dataExpiracao } = req.body;

  try {
      const empresa = await prisma.empresa.update({
          where: { id: Number(id) },
          data: {
              licenca: tipoLicenca,
              dataExpiracaoLicenca: new Date(dataExpiracao)
          }
      });
      res.status(200).json(empresa);
  } catch (error) {
      if (error.code === 'P2025') {
          return res.status(404).json({ message: 'Empresa não encontrada.' });
      }
      res.status(500).json({ message: 'Erro ao renovar licença', error: error.message });
  }
};

export const deleteEmpresa = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.empresa.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
     if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }
    res.status(500).json({ message: 'Erro ao deletar empresa.', error: error.message });
  }
};

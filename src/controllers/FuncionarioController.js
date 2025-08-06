import prisma from '../config/prisma.js';

export const createFuncionario = async (req, res) => {
  const { nome, cpf, email, senha, cargo, empresaId, telefones } = req.body;
  try {
    const novoFuncionario = await prisma.funcionario.create({
      data: {
        nome,
        cpf,
        email,
        senha,
        cargo,
        empresaId,
        telefones: {
          create: telefones,
        },
      },
      include: {
        telefones: true,
        empresa: { select: { id: true, razaoSocial: true } }
      },
    });
    res.status(201).json(novoFuncionario);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: `Erro: O ${error.meta.target.join(', ')} já está em uso.` });
    }
    res.status(500).json({ message: 'Erro ao criar funcionário.', error: error.message });
  }
};

export const getAllFuncionarios = async (req, res) => {
  try {
    const funcionarios = await prisma.funcionario.findMany({
      include: {
        telefones: true,
        empresa: { select: { id: true, razaoSocial: true } }
      },
    });
    res.status(200).json(funcionarios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar funcionários.', error: error.message });
  }
};

export const getFuncionarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: { id: Number(id) },
      include: {
        telefones: true,
        empresa: true,
        agendamentosRealizados: true,
        orcamentosElaborados: true
      },
    });
    if (!funcionario) {
      return res.status(404).json({ message: 'Funcionário não encontrado.' });
    }
    res.status(200).json(funcionario);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar funcionário.', error: error.message });
  }
};

export const updateFuncionario = async (req, res) => {
  const { id } = req.params;
  const { nome, email, cargo, senha } = req.body;
  try {
    const funcionarioAtualizado = await prisma.funcionario.update({
      where: { id: Number(id) },
      data: { nome, email, cargo, senha },
    });
    res.status(200).json(funcionarioAtualizado);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Funcionário não encontrado.' });
    }
    res.status(500).json({ message: 'Erro ao atualizar funcionário.', error: error.message });
  }
};

export const deleteFuncionario = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.funcionario.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Funcionário não encontrado.' });
    }
    res.status(500).json({ message: 'Erro ao deletar funcionário.', error: error.message });
  }
};

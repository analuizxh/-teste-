import prisma from '../config/prisma.js';

export const createCliente = async (req, res) => {
  const { nome, cpf_cnpj, email, telefones, enderecos } = req.body;
  try {
    const novoCliente = await prisma.cliente.create({
      data: {
        nome,
        cpf_cnpj,
        email,
        telefones: {
          create: telefones,
        },
        enderecos: {
          create: enderecos,
        },
      },
      include: {
        telefones: true,
        enderecos: true,
      },
    });
    res.status(201).json(novoCliente);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: `Erro: O ${error.meta.target.join(', ')} já está em uso.` });
    }
    res.status(500).json({ message: 'Erro ao criar cliente.', error: error.message });
  }
};

export const getAllClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        telefones: true,
        enderecos: true,
      },
    });
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar clientes.', error: error.message });
  }
};

export const getClienteById = async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(id) },
      include: {
        telefones: true,
        enderecos: true,
        agendamentos: true,
      },
    });
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar cliente.', error: error.message });
  }
};

export const updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;
  try {
    const clienteAtualizado = await prisma.cliente.update({
      where: { id: Number(id) },
      data: { nome, email },
    });
    res.status(200).json(clienteAtualizado);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    res.status(500).json({ message: 'Erro ao atualizar cliente.', error: error.message });
  }
};

export const deleteCliente = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.cliente.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    res.status(500).json({ message: 'Erro ao deletar cliente.', error: error.message });
  }
};

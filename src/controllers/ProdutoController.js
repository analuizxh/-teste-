import prisma from '../config/prisma.js';

export const createProduto = async (req, res) => {
  const { nome, categoria, descricaoTecnica } = req.body;
  try {
    const novoProduto = await prisma.produto.create({
      data: { nome, categoria, descricaoTecnica },
    });
    res.status(201).json(novoProduto);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar produto.', error: error.message });
  }
};

export const getAllProdutos = async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos.', error: error.message });
  }
};

export const getProdutoById = async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await prisma.produto.findUnique({
      where: { id: Number(id) },
    });
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produto.', error: error.message });
  }
};

export const updateProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const produtoAtualizado = await prisma.produto.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.status(200).json(produtoAtualizado);
  } catch (error) {
     if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    res.status(500).json({ message: 'Erro ao atualizar produto.', error: error.message });
  }
};

export const deleteProduto = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.produto.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
     if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    res.status(500).json({ message: 'Erro ao deletar produto.', error: error.message });
  }
};

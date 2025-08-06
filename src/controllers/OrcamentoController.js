import prisma from '../config/prisma.js';

export const createOrcamento = async (req, res) => {
  const { valorTotal, validade, funcionarioId, agendamentoMedidaId } = req.body;
  try {
    const novoOrcamento = await prisma.orcamento.create({
      data: {
        valorTotal,
        validade: new Date(validade),
        funcionarioId,
        agendamentoMedidaId,
      },
      include: { elaboradoPor: { select: { id: true, nome: true } }, agendamento: true },
    });
    res.status(201).json(novoOrcamento);
  } catch (error) {
    if (error.code === 'P2002') return res.status(409).json({ message: 'Este agendamento já possui um orçamento.' });
    res.status(500).json({ message: 'Erro ao criar orçamento.', error: error.message });
  }
};

export const getAllOrcamentos = async (req, res) => {
  try {
    const orcamentos = await prisma.orcamento.findMany({
      include: {
        elaboradoPor: { select: { id: true, nome: true } },
        agendamento: { include: { cliente: { select: { id: true, nome: true } } } },
      },
    });
    res.status(200).json(orcamentos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar orçamentos.', error: error.message });
  }
};

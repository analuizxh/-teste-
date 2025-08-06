import { Router } from 'express';
import {
  createProduto,
  getAllProdutos,
  getProdutoById,
  updateProduto,
  deleteProduto
} from '../controllers/ProdutoController.js';

const router = Router();

router.post('/', createProduto);
router.get('/', getAllProdutos);
router.get('/:id', getProdutoById);
router.put('/:id', updateProduto);
router.delete('/:id', deleteProduto);

export default router;
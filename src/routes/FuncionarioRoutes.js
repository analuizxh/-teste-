import { Router } from 'express';
import {
  createFuncionario,
  getAllFuncionarios,
  getFuncionarioById,
  updateFuncionario,
  deleteFuncionario
} from '../controllers/FuncionarioController.js';

const router = Router();

router.post('/', createFuncionario);
router.get('/', getAllFuncionarios);
router.get('/:id', getFuncionarioById);
router.put('/:id', updateFuncionario);
router.delete('/:id', deleteFuncionario);

export default router;
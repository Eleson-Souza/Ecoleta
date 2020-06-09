import express, { response } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import ItemsController from './controllers/ItemsControllers';
import PointsController from './controllers/PointsControllers';

const routes = express.Router();
const upload = multer(multerConfig);

// index, show, create, update, delete => Nomes dos métodos dos controllers geralmente usados pela comunidade.
const itemsController = new ItemsController();
const pointsController = new PointsController();

routes.get('/items', itemsController.index);

routes.post('/points', upload.single('image'), pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

export default routes;
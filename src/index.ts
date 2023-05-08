import dotenv from 'dotenv';
dotenv.config();

import App from './app';
import FileController from './controllers/file/file.controller';

const app = new App([new FileController()]);
app.listen();

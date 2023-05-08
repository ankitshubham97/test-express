import express from 'express';

import Controller from '../../interfaces/controller.interface';
import logger, { prettyJSON } from '../../services/logger';
import { HOOKS_API } from '../../path';

class HooksController implements Controller {
  public router = express.Router();
  public path = HOOKS_API;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/ocr`, this.ocrHook);
  }

  private ocrHook = async (
    request: express.Request,
    response: express.Response
  ) => {
    logger.error(prettyJSON(request.params));
    logger.error(prettyJSON(request.body));
    response.send('OK');
  };
}

export default HooksController;

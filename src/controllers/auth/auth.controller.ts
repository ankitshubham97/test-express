import express from 'express';
import Controller from '../../interfaces/controller.interface';

import { AUTH_API } from '../../path';
import {
  createFailureResponse,
  createSuccessResponse,
  processResponse,
} from '../../interfaces/response.interface';
import logger from '../../services/logger';
import { INTERNAL_SERVER_ERROR } from '../../constants';

class AuthController implements Controller {
  public router = express.Router();
  public path = AUTH_API;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/`, this.authenticate);
  }

  private authenticate = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      return processResponse(
        request,
        response,
        createSuccessResponse('To be implemented')
      );
    } catch (error) {
      logger.error(error);
      return response.send(createFailureResponse(500, INTERNAL_SERVER_ERROR));
    }
  };
}

export default AuthController;

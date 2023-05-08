import express from 'express';
import Controller from '../../interfaces/controller.interface';

import { FILES_API } from '../../path';

import { processResponse } from '../../interfaces/response.interface';
import multer from 'multer';

import { validationMiddleware } from '../../middleware/validation.middleware';
import FileUploadViaUrlDto from './dto/fileUploadViaUrl.dto';
import FileService from './file.service';

class FileController implements Controller {
  public router = express.Router();
  public path = FILES_API;
  public fileService = new FileService();
  public upload = multer({ dest: 'uploads/' });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/upload-via-url`,
      validationMiddleware('body', FileUploadViaUrlDto),
      this.fileUploadViaUrl
    );
  }

  private fileUploadViaUrl = async (
    request: express.Request,
    response: express.Response
  ) => {
    const payload = request.body as FileUploadViaUrlDto;
    return processResponse(
      request,
      response,
      await this.fileService.fileUploadViaUrl({ payload })
    );
  };
}

export default FileController;

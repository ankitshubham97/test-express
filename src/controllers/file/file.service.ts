import logger from '../../services/logger';

import { sequelize } from '../../models/sql/sequelize';
import File from '../../models/sql/file.model';
import FileUploadViaUrlDto from './dto/fileUploadViaUrl.dto';
import { createSuccessResponse } from '../../interfaces/response.interface';
import * as fs from 'fs';
import * as stream from 'stream';
import axios from 'axios';
import { promisify } from 'util';

class FileService {
  public fileRepository = sequelize.getRepository(File);

  // private download = function({url, dest, cb}: {url: string, dest: string, cb: any}) {
  //   const file = fs.createWriteStream(dest);
  //   https.get(url, function(response) {
  //     response.pipe(file);
  //     file.on('finish', function() {
  //       file.close(cb);  // close() is async, call cb after close completes.
  //     });
  //   }).on('error', function(err) { // Handle errors
  //     fs.unlink(dest, ()=>{}); // Delete the file async. (But we don't check the result)
  //     if (cb) cb(err.message);
  //   });
  // };

  public async fileUploadViaUrl({ payload }: { payload: FileUploadViaUrlDto }) {
    try {
      // 1. Download file from url
      const tmpUrl = payload.fileUrl;
      logger.info(`Downloading file from ${tmpUrl}`);
      // Download to temporary storage.
      const tmpFile = './tmp/' + payload.fileName;
      // this.download({
      //   url: tmpUrl,
      //   dest: tmpFile,
      //   cb: (err: any) => {
      //     if (err) {
      //       logger.error(err);
      //       throw err;
      //     }
      //     logger.info(`Downloaded file to ${tmpFile}`);
      //   }
      // });
      const finishedDownload = promisify(stream.finished);
      const writer = fs.createWriteStream(tmpFile);

      const response = await axios({
        method: 'GET',
        url: payload.fileUrl,
        responseType: 'stream',
      });

      response.data.pipe(writer);
      await finishedDownload(writer);

      // 2. Upload file to Azure blob storage
      // 3. Create file record in database

      return createSuccessResponse('OK');
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

export default FileService;

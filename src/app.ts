import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import errorMiddleware from './middleware/error.middleware';
import Controller from './interfaces/controller.interface';

class App {
  public app: express.Application;
  public port = process.env.PORT || 3000;

  constructor(controllers: readonly Controller[]) {
    this.app = express();

    this.initializeStandardMiddlewares();
    this.initializeControllers(controllers);
  }

  public listen(): void {
    this.app.listen(Number(this.port), () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  public getServer(): express.Application {
    return this.app;
  }

  private initializeStandardMiddlewares() {
    this.app.set('trust proxy', true);

    // Ignore big payloads
    this.app.use(
      express.urlencoded({
        extended: true,
        limit: '100mb',
      })
    );
    this.app.use(
      express.json({
        limit: '100mb',
      })
    );
    this.app.use(bodyParser.json());
    this.app.use(
      express.urlencoded({
        extended: true,
      })
    );

    this.app.use(cookieParser());
    this.app.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );

    // Protect against HTTP Parameter Pollution
    this.app.use(hpp());

    // Protect against multiple things
    this.app.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );

    this.app.use('/checks', (_req, res) => res.send('OK'));

    // Enable CORS
    this.app.use(
      cors({
        origin: (origin, callback) => {
          // allow requests with no origin
          // (like mobile apps or curl requests)
          if (!origin) {
            return callback(null, true);
          }

          // Allow localhost on non production envs
          if (
            origin.match(/localhost/) &&
            process.env.NODE_ENV !== 'production'
          ) {
            return callback(null, true);
          }

          if (!origin.match(/fuze.finance/)) {
            const msg = `The CORS policy for this site does not allow access from the specified origin.`;
            return callback(new Error(msg), false);
          }

          return callback(null, true);
        },
        credentials: true,
      })
    );
  }

  private initializeControllers(controllers: readonly Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });

    // Error Handling
    this.app.use(errorMiddleware);
  }
}

export default App;

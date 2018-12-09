import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as expressPino from 'express-pino-logger';
import * as Redis from 'ioredis';
import * as pino from 'pino';

const log = pino({ name: 'my-app' });
if (__DEV__) {
  log.level = 'debug';
}

const db = new Redis(process.env.APP_REDIS_URL);

const app = express();

app.use(
  expressPino({
    logger: log,
  })
);
app.use(bodyParser.json());

const createResponseHandler = fn => async (req, res) => {
  try {
    const data = await fn(req, res);
    res.json({ error: null, data });
  } catch (error) {
    res.json({ error: error.message, data: null });
  }
};

app.get(
  '/db/:key',
  createResponseHandler(async req => {
    const key = req.params.key;

    const json = await db.get(req.params.key);
    const data = JSON.parse(json);
    req.log.debug({ key, data }, 'fetched data');

    return data;
  })
);

app.post(
  '/db/:key',
  createResponseHandler(async req => {
    const key = req.params.key;
    const data = req.body.data;

    req.log.debug({ key, data }, 'saving data');
    await db.set(key, JSON.stringify(data));

    return data;
  })
);

(async () => {
  const port = process.env.PORT || 3000;

  await new Promise(resolve => app.listen(port, resolve));

  log.info('server is listening on %s', port);
})();

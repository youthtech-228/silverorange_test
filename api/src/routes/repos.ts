import { Router, Request, Response } from 'express';
import axios from 'axios';

export const repos = Router();

repos.get('/', async (_: Request, res: Response) => {
  try {
    res.header('Cache-Control', 'no-store');
    res.status(200);
    // TODO: See README.md Task (A). Return repo data here. You’ve got this!
    axios.get(
      'https://api.github.com/users/silverorange/repos', 
      {
        headers: {
          Accept: 'application/json',
        }
      }
    ).then((response) => {
      let result = [];
      result = response.data.filter((item: any) => item.fork === false);
      res.json(result);
    }).catch((err: unknown) => {
      if (typeof err === 'string') {
        err.toUpperCase();
      } else if (err instanceof Error) {
        res.status(500).json(`err: ${err.message}`);
      }
    })
  } catch (err: unknown) {
    if (typeof err === 'string') {
      err.toUpperCase();
    } else if (err instanceof Error) {
      res.status(500).json(`err: ${err.message}`);
    }
  }
});

import http from 'http';
import url from 'url';

import pool from './db/db.js';
import GenreController from './controller/GenreController.js';
import FilmController from './controller/FilmController.js';

class App {
  constructor() {
    this.pool = pool;
    this.filmController = new FilmController();
    this.genreController = new GenreController();
    this.server = this._createServer();
  }

  _createServer() {
    return http.createServer(async (req, res) => {
      const sendResponse = (statusCode, body) => {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(body));
        res.end();
      };
      const parsedUrl = url.parse(req.url, true);
      const path = parsedUrl.pathname;
      // Обработка запросов для URL /api/film
      if (path.startsWith('/api/film')) {
        if (req.method === 'GET') {
          if (path.match(/^\/api\/film\/\d+$/)) {
            this.filmController.getFilmById(path, sendResponse, this.pool);
          } else {
            this.filmController.getAllFilms(sendResponse, this.pool);
          }
        } else if (req.method === 'POST') {
          this.filmController.create(req, sendResponse, this.pool);
        } else if (req.method === 'PUT' && path.match(/^\/api\/film\/\d+$/)) {
          this.filmController.update(path, req, sendResponse, this.pool);
        } else if (
          req.method === 'DELETE' &&
          path.match(/^\/api\/film\/\d+$/)
        ) {
          this.filmController.delete(path, sendResponse, this.pool);
        }
      }
      // Обработка запросов для URL /api/genre
      else if (path.startsWith('/api/genre')) {
        // GET /api/genre - получить список жанров
        if (req.method === 'GET') {
          if (path.match(/^\/api\/genre\/\d+$/)) {
            this.genreController.getAllFilmsByGenre(
              path,
              sendResponse,
              this.pool
            );
          } else {
            this.genreController.getAllGenres(sendResponse, this.pool);
          }
        }
      } else {
        sendResponse(404, { error: 'Not found' });
      }
    });
  }
  start() {
    this.server.listen(5000, () => console.log(`Server started on PORT 5000`));
  }
}
export default App;

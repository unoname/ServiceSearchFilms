class GenreController {
  async getAllGenres(callback, pool) {
    try {
      const { rows } = await pool.query('SELECT name FROM genre;');
      callback(200, rows);
    } catch (err) {
      callback(500, { error: 'Failed to retrieve genres' });
    }
  }
  async getAllFilmsByGenre(path, callback, pool) {
    try {
      const genreName = path.split('/')[3];
      const { rows } = await pool.query(
        `SELECT film.id, film.title, film.release_date 
				FROM film 
				JOIN film_genre ON film.id = film_genre.film_id 
				JOIN genre ON film_genre.genre_id = genre.id 
				WHERE genre.name = ${genreName};`
      );
      callback(200, rows);
    } catch (err) {
      callback(500, { error: 'Failed to retrieve genres' });
    }
  }
}

export default GenreController;

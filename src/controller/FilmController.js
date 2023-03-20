class FilmController {
  async create(req, callback, pool) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const { title, release_date, genre } = JSON.parse(body);
      try {
        const { rows } = await pool.query(
          ` WITH new_film AS (
						INSERT INTO film (title, release_date)
						VALUES ($1, $2)
						RETURNING id, title, release_date
					), new_genre AS (
						INSERT INTO genre (name)
						VALUES ($3)
						RETURNING id
					)
					INSERT INTO film_genre (film_id, genre_id)
					SELECT new_film.id, new_genre.id
					FROM new_film, new_genre RETURNING new_film.*, new_genre.id;`,
          [title, release_date, genre]
        );
        callback(201, rows);
      } catch (err) {
        console.log(err.code)
        console.log(err.message)
        callback(500, { error: 'Failed to create film' });
      }
    });
  }

  async getAllFilms(callback, pool) {
    try {
      const { rows } = await pool.query(
        `SELECT film.*, array_agg(genre.name) AS genres
					FROM film, genre, film_genre
					WHERE film.id = film_genre.film_id
					AND genre.id = film_genre.genre_id
					GROUP BY film.id`
      );
      if (rows.length === 0) {
        callback(200, {});
      } else {
        callback(200, rows);
      }
    } catch (err) {
      console.error(err);
      callback(500, { error: 'Failed to retrieve films' });
    }
  }

  async getFilmById(path, callback, pool) {
    try {
      const filmId = parseInt(path.split('/')[3]);
      const { rows } = await pool.query(
        `SELECT film.id, film.title, film.release_date, genre.name
         FROM film
         JOIN film_genre ON film.id = film_genre.film_id
         JOIN genre ON film_genre.genre_id = genre.id
         WHERE film.id = ${filmId};`
      );
      if (rows.length === 0) {
        callback(200, {});
      } else {
        callback(200, rows);
      }
    } catch (err) {
      console.error(err);
      callback(500, { error: 'Failed to retrieve films' });
    }
  }

  async update(path, req, callback, pool) {
    const filmId = parseInt(path.split('/')[3]);
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const { title, release_date } = JSON.parse(body);
      try {
        if (title && release_date) {
          const { rows } = await pool.query(
            'UPDATE film SET title = $1, release_date = $2 WHERE id = $3 RETURNING *',
            [title, release_date, filmId]
          );
        } else {
          if (title && !release_date) {
            const { rows } = await pool.query(
              'UPDATE film SET title = $1 WHERE id = $2 RETURNING *',
              [title, filmId]
            );
          } else if (!title && release_date) {
            const { rows } = await pool.query(
              'UPDATE film SET release_date = $1 WHERE id = $2 RETURNING *',
              [release_date, filmId]
            );
          }
        }
        callback(200, rows[0]);
      } catch (err) {
        callback(500, { error: 'Failed to update film' });
      }
    });
  }
  async delete(path, callback, pool) {
    const filmId = parseInt(path.split('/')[3]);
    try {
      const { rows } = await pool.query(
        `DELETE FROM film_genre WHERE film_id = ${filmId}; DELETE FROM film WHERE id = ${filmId};`
      );
      callback(204, {});
    } catch (err) {
      callback(500, { error: 'Failed to delete film' });
    }
  }
}

export default FilmController;

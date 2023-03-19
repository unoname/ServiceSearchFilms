
CREATE DATABASE db_homework;
CREATE TABLE film (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  release_date INTEGER NOT NULL   
);


CREATE TABLE genere (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);


CREATE TABLE film_genere (
    film_id INTEGER REFERENCES film(id),
    genre_id INTEGER REFERENCES genre(id),
    PRIMARY KEY(film_id, genre_id)
);






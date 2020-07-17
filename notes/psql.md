






CREATE TABLE weight_data (
  ID SERIAL PRIMARY KEY,
  pod_uuid UUID,
  timestamp TIMESTAMP,
  weight_value NUMERIC(4, 2)
);

CREATE ROLE admin WITH LOGIN PASSWORD 'pppppppp';

CREATE DATABASE hotwdb;

\c hotwdb 

CREATE TABLE nominees (
  ID SERIAL PRIMARY KEY,
  first_name VARCHAR(256),
  last_name VARCHAR(256),
  nickname VARCHAR(256),
  image VARCHAR(256)
);

CREATE TABLE nominations (
  ID SERIAL PRIMARY KEY,
  nominee_id INTEGER,
  message VARCHAR(4096)
);



ALTER TABLE nominations
ADD COLUMN archive_time TIMESTAMP;

ALTER TABLE nominations
ADD COLUMN giphy_url VARCHAR(512);

ALTER TABLE nominations
DROP COLUMN gify_url

INSERT INTO nominees (first_name, last_name, nickname, image)
  VALUES 
    ('Jake', 'Hollis', 'Burt', '/images/Jake-Hollis-blue-round.png'), 
    ('Kirsty', 'Bewley', 'Frontend Ninja', '/images/Kirsty-Bewley-round.png');


SELECT * 
FROM nominations nt
JOIN nominees ne
ON ne.id = nt. nominee_id
ORDER BY nt.id ASC



UPDATE nominations
SET archive_time = NOW()
WHERE archive_time IS NULL



psql DBNAME USERNAME 		Login from command line
psql hotwdb

\l		List databases
\dt 		List tables
\conninfo 	Connection info
\q 		Exit
\du		List users


## Export DB:


pg_dump -Fc --no-acl --no-owner -U ashley hotwdb > hotw.dump



## Import to Heroku:

Postgres import can only be done via a database url. One can be temporarily made by exposing your local project folder via Ngrok. E.g:

`ngrok http file:///home/ashley/projects/hotw/`

Then you can import like:

`heroku pg:backups:restore http://bd65fc8b.ngrok.io/hotw.dump`


## Making the product data table:
CREATE TABLE product_data (
  ID SERIAL PRIMARY KEY,
  pod_uuid UUID,
  timestamp TIMESTAMP,
  sku VARCHAR(256),
  title VARCHAR(256),
  zero NUMERIC(8, 2),
  multiplier NUMERIC(8, 2)
);

ALTER TABLE product_data
ADD COLUMN unit_weight NUMERIC(4, 2);

ALTER TABLE product_data
ADD COLUMN unit VARCHAR(8);

ALTER TABLE weight_data ALTER COLUMN weight_value NUMERIC(10, 2);
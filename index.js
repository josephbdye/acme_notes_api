const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_notes_db');
const express = require('express');
const app = express();

app.get('/api/notes', async(req, res, next)=> {
    try {
        const SQL = `
            SELECT *
            FROM notes
        `;
        const response = await client.query(SQL);
        res.send(response.rows);
    }
    catch(ex){
        next(ex);
    }
});

const init = async()=> {
  console.log('connecting to database');
  await client.connect();
  console.log('connected to database');
  let SQL = `
    DROP TABLE IF EXISTS notes;
    CREATE TABLE notes(
      id SERIAL PRIMARY KEY,
      txt VARCHAR(255) UNIQUE
    );
  `;
  await client.query(SQL);
  console.log('tables created.');
  SQL = `
    INSERT INTO notes(txt) VALUES('learn SQL');
    INSERT INTO notes(txt) VALUES('learn more SQL');
    INSERT INTO notes(txt) VALUES('learn express');
    INSERT INTO notes(txt) VALUES('adding logging middleware');    
  `;
  await client.query(SQL);
  console.log('data seeded');
  const port = process.env.PORT || 3000;
  app.listen(port, ()=> console.log(`listening on port ${port}`));
  
  
}

init();
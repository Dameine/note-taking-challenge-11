const express = require('express');
const app = express();
const port = 3001;
const path = require('path');
const fs = require('fs');

//require uuid
const { v4: uuidv4 } = require('uuid');


app.use(express.static('public'));

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//index html route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//notes html route
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

//api routes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.json(JSON.parse(data));
  });
});


//Post notes
app.post('/api/notes', (req, res) => {

  //reads the db.json file
  fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    //assign variable note to parse the data
    const notes = JSON.parse(data);

    //assignes newNote to the request body
    const newNote = req.body;

    //assigns a unique id to the newNote
    newNote.id = uuidv4();

    //pushes the newNote to the notes array
    notes.push(newNote);

    //writes the new note to the db.json file
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      res.json(newNote);
    });
  });
});

//delete notes
app.delete('/api/notes/:id', (req, res) => {
  //reads the db.json file
  fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    //assign variable note to parse the data
    const notes = JSON.parse(data);

    //filters the notes array to exclude the note with the id that matches the request parameter
    const newNotes = notes.filter((note) => note.id !== req.params.id);

    //writes the new notes array to the db.json file
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(newNotes), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      res.json(newNotes);
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

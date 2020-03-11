const express = require('express')
const app = express()
const bodyparser = require('body-parser')

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

var mysql = require('mysql2');
var connection = mysql.createConnection({
  host: '172.17.0.3',
  database: 'Todos',
  user: 'root',
  password: 'root'
});

app.get('/', function (req, res) {
  res.send('Hello World ! Todos Project');
});

app.get('/todos', function (req, res) {
  let sql = 'Select * from todos';
  connection.query(sql, function (err, result) {
    result.map(function (todo) {
      if (todo.isDone == '1') {
        todo.isDone = true;
      }
      else {
        todo.isDone = false;
      }
    });
    res.json(result);
  })
});

app.post('/todos', function (req, res) {
  let label = req.body.label;
  let isDone = (req.body.isDone == 'true');
  
  let sql = 'insert into todos(label,isDone) values (?,?);'
  connection.query(sql,[label,isDone], function (err, result) {
    res.redirect('/todos');
  })
});

app.put('/todos/:id', function (req, res) {
  let id = req.params.id;
  let label = req.body.label;
  let isDone = (req.body.isDone == 'true');
  
  let sql = 'update todos set label=?, isDone=? where id=?'
  connection.query(sql,[label,isDone,id], function (err, result) {
    res.redirect('/todos');
  })
});

app.delete('/todos/:id', function (req, res) {
  let id = req.params.id;
  
  let sql = 'delete from todos where id=?'
  connection.query(sql,[id], function (err, result) {
    res.redirect('/todos');
  })
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
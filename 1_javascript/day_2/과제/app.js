const express = require('express');
const path = require('path');

const app = express();
const port = 3001;

app.use('/resource', express.static(path.join(__dirname, 'resource')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/login')
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/sales/inquiry', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sales-inquiry.html'));
});

app.get('/sales/modification', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sales-input.html'));
});

app.get('/sales/registraion', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sales-input.html'));
});

app.get('/sales/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'item-inquiry.html'));
});

app.get('/item/inquiry', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'item-inquiry.html'));
});

app.get('/item/registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'item-registration.html'));
});

app.get('/item/modification', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'item-registration.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
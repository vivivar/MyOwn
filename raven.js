const { DocumentStore } = require('ravendb');
const store = new DocumentStore([ "http://127.0.0.1:8080" ]);
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const { Console } = require('console');
store.initialize();

// Set Port
const port = 3000;


var results;

const session = store.openSession("prueba");


const app = express();

// View Engine\
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// methodOverride
app.use(methodOverride('_method'));

app.listen(port, function(){
  console.log('Server started on port '+port);
});

app.get('/', function(req, res, next){
  res.render('log');
});

app.get('/user/reg', function(req, res, next){
  res.render('register');
});


app.post('/user/reg', function(req, res, next){
	let email_input = req.body.email;
	let password_input = req.body.password_in;
	let newuser = {
		"email": email_input,
		"password" : password_input,
		"@metadata" : {"@collection" : "Users"}
	}

	session.store(newuser, "users/");	
	session.saveChanges();
	res.render('search');
});

app.post('/user/log', function(req, res, next){
  let id = req.body.id;
  let loginPassword = req.body.loginPassword;
  res.render('search');
});


app.post('/user/buscarbook', function(req, res, next){
	let option = req.body.radioOption;
	let busqueda = req.body.id_search;
	console.log(busqueda);
	if (option=="autor"){
		let books = session.advanced
	    .rawQuery("from Books where search(author, " + "'" + busqueda + "'" + ")")
	    .all()
	    .then(val => {
	    	console.log(val);
	    	res.render('search', {
	    		libros : val,
	    	});

	    });
	}else if (option =="genero"){
		let books = session.advanced
	    .rawQuery("from Books where search(gender, " + "'" + busqueda + "'" + ")")
	    .all()
	    .then(val => {
	    	console.log(val);
	    	res.render('search', {
	    		libros : val,
	    	});

	    });
	}else{
		let books = session.advanced
	    .rawQuery("from Books")
	    .all()
	    .then(val => {
	    	console.log(val);
	    	res.render('search', {
	    		libros : val,
	    	});

	    });
	}

});

app.get('/user/buscarbook', function(req, res, next){
  res.render('search');
});


app.get('/user/addbook', function(req, res, next){
  res.render('agregar');
});

app.post('/user/addbook', function(req, res, next){
	let title = req.body.title;
	console.log(title);
	let author = req.body.author;
	let gender = req.body.gender;
	let newbook = {
		title: title,
		author : author,
		gender : gender,
		"@metadata" : {"@collection" : "Books"}
	}

	session.store(newbook, "books/");	
	session.saveChanges();
	res.render('search');	
});
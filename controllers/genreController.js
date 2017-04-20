var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');


// Display list of all Genre
exports.genre_list = function(req, res, next) {
    Genre.find()
    .sort([['name', 'ascending']])
    .exec(function(err, list_genres) {
      if(err) {return next(err);}
      //successful, so render
      res.render('genre_list', {title: 'Genre List', genre_list: list_genres});
    });
};

// Display detail page for a specific Genre
exports.genre_detail = function(req, res, next) {


  async.parallel({
    genre: function(callback) {
      Genre.findById(req.params.id)
        .exec(callback);
    },

    genre_books: function(callback) {
      Book.find({ 'genre': req.params.id})
        .exec(callback);
    },

  }, function(err, results) {
        if (err) {return next(err);}
        //successful so render
        res.render('genre_detail', {title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books} );
    })

};

// Display Genre create form on GET
exports.genre_create_get = function(req, res, next) {
    res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST
exports.genre_create_post = function(req, res, next) {
    //Check that name is not empty
    req.checkBody('name', 'Genre name required').notEmpty();

    req.sanitize('name').escape();
    req.sanitize('name').trim();

    //run the validators
    var errors = req.validationErrors();

    //create a genre object with escaped and trimmed data

    var genre = new Genre(
      { name: req.body.name }
    );

    if (errors) {
      //If there are errors, render it again with the old values and errors
      res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors});
    return;
    }
    else {
      //Data from form is validators
      // Check if Genre with same name exists
      Genre.findOne({'name': req.body.name})
        .exec( function(err, found_genre) {
          console.log('found_genre: ' + found_genre);
          if (err) {return next(err);}

          if(found_genre) {
            // Genre exists, redirects to detail page
            res.redirect(found_genre.url);
          }
          else {
            genre.save(function (err) {
              if(err) { return next(err); }
              //Genre saved Redirect to genre detail page
              res.redirect(genre.url);
            });
          }

        });
    }


};

// Display Genre delete form on GET
exports.genre_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST
exports.genre_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET
exports.genre_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST
exports.genre_update_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};

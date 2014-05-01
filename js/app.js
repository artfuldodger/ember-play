App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Product = DS.Model.extend({
  title: DS.attr('string'),
  price: DS.attr('number'),
  description: DS.attr('string'),
  isOnSale: DS.attr('boolean'),
  image: DS.attr('string'),
  reviews: DS.hasMany('review', { async: true })
});

App.ProductDetailsComponent = Ember.Component.extend({
  reviewsCount: Ember.computed.alias('product.reviews.length'),
  tagName: 'li',
  classNames: ['row'],
  hasReviews: function() {
    return this.get('reviewsCount') > 0;
  }.property('reviewsCount')
});

App.Review = DS.Model.extend({
  text: DS.attr('string'),
  reviewedAt: DS.attr('date'),
  product: DS.belongsTo('product')
});

/* Ember data:

HTTP server with JSON (default)
App.ApplicationAdapter = DS.RESTAdapter.extend();

From memory:
App.ApplicationAdapter = DS.FixtureAdapter.extend();
*/

App.Router.map(function() {
  this.route('about');
  this.route('about', { path: '/about_us' });
  this.resource('products', function() {
    this.resource('product', { path: '/:product_id' });
    this.route('onsale');
  });
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll('product');
  }
});

App.ProductsRoute = Ember.Route.extend({
  model: function() {
    // Fetches records from http://example.com/products/order=title
    // Require server to sort
    // return this.store.find('product', { order: 'title' })

    return this.store.findAll('product');
  }
});

/* Default Route:
App.ProductRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('product', params.product_id);
  }
})
*/

App.ProductsOnsaleRoute = Ember.Route.extend({
  model: function() {
    // modelFor returns the model from the given route
    return this.modelFor('products').filterBy('isOnSale');
  }
});

App.IndexController = Ember.ArrayController.extend({
  // productsCount: function() {
  //   return this.get('length'); // Checks controller for length property, falls back to model
  // }.property('length'), // Watches length property of controller and updates productsCount if it changes
  productsCount: Ember.computed.alias('length'), // Shorthand for above
  logo: '/images/logo.png',
  // onSale: function() {
  //   return this.filter(function(product) {
  //     return product.get('isOnSale');
  //   });
  // }.property(),
  onSale: function() { // Shorthand for above
    return this.filterBy('isOnSale').slice(0,3); // Second param to filterBy defaults to true
  }.property('@each.isOnSale'), // Monitor each one's isOnSale property
  time: function() {
    return (new Date()).toDateString();
  }.property()
});

App.AboutController = Ember.Controller.extend({
  stuff: 'whatever',
  open: function() {
    sunday = (new Date()).getDay() == 0;
    status = sunday ? 'Closed' : 'Open';
    return status;
  }.property()
});

App.ReviewsController = Ember.ArrayController.extend({
  sortProperties: ['reviewedAt'],
  sortAscending: false
});

App.ProductsController = Ember.ArrayController.extend({
  sortProperties: ['title'],
  // sortAscending: false // Sorts ascending by default
});

App.ProductController = Ember.ObjectController.extend({
  text: '', // If left off, the property would be set on the model
  review: function() {
    return this.store.createRecord('review', {
      product: this.get('model')
    });
  }.property('model'),
  isNotReviewed: Ember.computed.alias('review.isNew'),
  actions: {
    createReview: function() {
      // Build a new Review object
      var controller = this; // Reference for callback
      this.get('review').set('reviewedAt', new Date());
      this.get('review').save().then(function(review) {
        controller.get('model.reviews').addObject(review);
      })

      // Save the review
      review.save().then(function(review) {
        controller.set('text', '');
        controller.get('model.reviews').addObject(review);
      });
    }
  }
});

App.ProductView = Ember.View.extend({
  classNames: ['row'],
  classNameBindings: ['isOnSale'], // adds class 'is-on-sale' is isOnSale property is true
  isOnSale: Ember.computed.alias('controller.isOnSale') // Access to model property via controller
})

App.Product.FIXTURES = [
  {
    id:          1,
    title:       'Flint',
    price:       99,
    description: 'Flint is a thing',
    isOnSale:    true,
    image:       'flint.png',
    reviews:     [100, 101]
  },
  {
    id:          2,
    title:       'Kindling',
    price:       249,
    description: 'Kindling is a thing',
    isOnSale:    false,
    image:       'kindling.png'
  }
]

App.Review.FIXTURES = [
  {
    id: 100,
    product: 1,
    text: 'Started a fire in no time!'
  },
  {
    id: 101,
    product: 1,
    text: 'Not the brightest flame, but warm.'
  }
]

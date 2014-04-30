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
  });
});

App.ProductsRoute = Ember.Route.extend({
  model: function() {
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

App.IndexController = Ember.Controller.extend({
  productsCount: 6,
  logo: '/images/logo.png',
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

App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.PRODUCTS = [
  {
    title: 'Flint',
    price: 99,
    description: 'Flint is a thing',
    isOnSale: true,
    image: 'flint.png'
  },
  {
    title: 'Kindling',
    price: 249,
    description: 'Kindling is a thing',
    isOnSale: false,
    image: 'kindling.png'
  }
]

App.Router.map(function() {
  this.route('about');
  this.route('about', { path: '/about_us' });
  this.resource('products')
  this.resource('product', { path: '/products/:title' })
});

App.ProductsRoute = Ember.Route.extend({
  model: function() {
    return App.PRODUCTS;
  }
});

App.ProductRoute = Ember.Route.extend({
  model: function(params) {
    return App.PRODUCTS.findBy('title', params.title);
  }
})

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

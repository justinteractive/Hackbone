// Backbone.View
// -------------

// Options with special meaning *(e.g. model, collection, id, className)* are
// attached directly to the view.  See `viewOptions` for an exhaustive
// list.

// Set up all inheritable **Backbone.View** properties and methods.
var View = Backbone.View = BaseView.extend({
    constructor: function (options) {
        options || (options = {});
        _.extend(this, _.pick(options, View.viewOptions));
        BaseView.call(this, options);
    }
}, {
    // List of view options to be merged as properties.
    viewOptions: ['model', 'collection']
});
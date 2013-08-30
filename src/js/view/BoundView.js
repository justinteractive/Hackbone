// Backbone.BoundView
// ------------------

// Backbone BoundViews extend the basic Backbone.View functionality
// by handling explicitly defined/provided view model via Knockout (>=2.3.0).
// This is handy when you have to work with streaming data. Instead of
// rerendering the whole view, you only need to update your viewModel
// explicitly (for instance: from a Controller) and the View updates.

// TODO: this has been implemented "blindly". Test it out properly!
var BoundView = Backbone.BoundView = View.extend({
    constructor: function (options) {
        options || (options = {});
        View.call(this, options);
        this.viewModelApplied = false;
        this.setViewModel(options.viewModel);
    },

    // Sets the viewModel for the View using the
    // 'model' property on the View instance
    // By default, the BoundView will not render,
    // but passing a true as second argument will do it.
    setViewModel: function (viewModel, render) {
        if (viewModel) {
            this.viewModelApplied && ko.cleanNode(this.el);
            this.viewModelApplied = false;
            this.model = viewModel;

            if (render === true) {
                this.render();
            }
        }
        return this;
    },

    // Applies the Knockout data bindings to the given or the existing viewmodel
    applyBindings: function (viewModel) {
        if (!this.viewModelApplied) {
            this.model || this.setViewModel(viewModel);
            ko.applyBindings(this.model, this.el);
            this.viewModelApplied = true;
        }
        return this;
    },

    // Removes the Knockout data bindings
    removeBindings: function () {
        ko.cleanNode(this.el);
        this.viewModelApplied = false;
        return this;
    },

    render: function (viewModel) {
        this.applyBindings(viewModel);
        return View.prototype.render.call(this);
    },

    remove: function () {
        this.removeBindings();
        return View.prototype.remove.call(this);
    }
});
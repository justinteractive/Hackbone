# Backbone.BoundView - extends Backbone.View

Backbone.View with Knockout data bindings. See [test file](https://github.com/benqus/backbone2/blob/master/src/ext/index.html).

## Usage:

### Template:

    <div id="View">
        <input type="text" data-bind="value: name, event: {keyup: update}" />
        <p data-bind="text: sayHi"></p>
    </div>

### ViewModel:

    //ViewModel class definition in Backbone2 way
        var ViewModel = Backbone.Base.extend({
            constructor: function (name) {
                this.name = ko.observable(name || "unknown");
                this.sayHi = ko.computed(function () {
                    return "Hello, " + this.name() + "!";
                }, this);
            },
            update: function (viewModel, evt) {
                this.name(evt.target.value);
            }
        });

    //creating a ViewModel instance
    var viewModel = new ViewModel("benqus");

### BoundView (with template):

    //creating a BoundView instance
    var view = new Backbone.BoundView({
        el: $("#View")[0]
    });

    //setting the ViewModel instance for the BoundView instance
    //and render the view
    view.setViewModel(viewModel)
        .render();
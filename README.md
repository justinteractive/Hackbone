Hackbone
========

Hackbone is Backbone... Hacked, to support multiple design patterns on your front end. Yes, properly.

 - MV
 - MVC
 - MVP
 - MVC + VM (with Hackbone.BoundView)
 - MVP + VM (with Hackbone.BoundView)

### New classes introduced (compared to basic Backbone which still exist)

 > Hackbone.Base

 - base class to extend for code-consistency across your whole codebase.

 > Hackbone.BaseView (extends Hackbone.Base)

 - base View class without knowledge of any State, Model or Collection
 - super class for `Hackbone.View`

 > Hackbone.State

 - base REST-less Model class (no save, fetch, etc. async REST features)
 - Super class for `Hackbone.Model`

### Dependencies:

 - jQuery (as in Backbone)
 - underscore (as in Backbone)
 - Knockout for `Hackbone.BoundView`are

### Hackbone.BoundView

Hackbone.View with Knockout data bindings

## Usage:

### Template:

    <div id="View">
        <input type="text" data-bind="value: name, event: {keyup: update}" />
        <p data-bind="text: sayHi"></p>
    </div>

### ViewModel:

    //ViewModel class definition in Hackbone way
    var ViewModel = Hackbone.Base.extend({
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
    var view = new Hackbone.BoundView({
        el: $("#View")[0],
        viewModel: viewModel
    });

    //rendering the view will apply the bindings
    view.render();
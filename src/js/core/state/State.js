//Backbone.State

//Backbone.State provides a simple evented data-store without any RESTful features.
var State = Backbone.State = Base.extend({
    idAttribute: 's',

    constructor: function (attributes, options) {
        var defaults;
        var attrs = attributes || {};
        options || (options = {});
        this.cid = _.uniqueId('c');
        this.attributes = {};
        if (options.collection) this.collection = options.collection;
        if (options.parse) attrs = this.parse(attrs, options) || {};
        options._attrs || (options._attrs = attrs);
        if (defaults = _.result(this, 'defaults')) {
            attrs = _.defaults({}, attrs, defaults);
        }
        this.set(attrs, options);
        this.changed = {};
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function () {
    },

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // Return a copy of the State's `attributes` object.
    toJSON: function (options) {
        return _.clone(this.attributes);
    },

    // Get the value of an attribute.
    get: function (attr) {
        return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function (attr) {
        return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function (attr) {
        return this.get(attr) != null;
    },

    // Set a hash of State attributes on the object, firing `"change"`. This is
    // the core primitive operation of a State, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function (key, val, options) {
        var attr, attrs, unset, changes, silent, changing, prev, current;
        if (key == null) return this;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (typeof key === 'object') {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }

        options || (options = {});

        // Run validation.
        if (!this._validate(attrs, options)) return false;

        // Extract attributes and options.
        unset = options.unset;
        silent = options.silent;
        changes = [];
        changing = this._changing;
        this._changing = true;

        if (!changing) {
            this._previousAttributes = _.clone(this.attributes);
            this.changed = {};
        }
        current = this.attributes, prev = this._previousAttributes;

        // Check for changes of `id`.
        if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

        // For each `set` attribute, update or delete the current value.
        for (attr in attrs) {
            val = attrs[attr];
            if (!_.isEqual(current[attr], val)) changes.push(attr);
            if (!_.isEqual(prev[attr], val)) {
                this.changed[attr] = val;
            } else {
                delete this.changed[attr];
            }
            unset ? delete current[attr] : current[attr] = val;
        }

        // Trigger all relevant attribute changes.
        if (!silent) {
            if (changes.length) this._pending = true;
            for (var i = 0, l = changes.length; i < l; i++) {
                this.trigger('change:' + changes[i], this, current[changes[i]], options);
            }
        }

        // You might be wondering why there's a `while` loop here. Changes can
        // be recursively nested within `"change"` events.
        if (changing) return this;
        if (!silent) {
            while (this._pending) {
                this._pending = false;
                this.trigger('change', this, options);
            }
        }
        this._pending = false;
        this._changing = false;
        return this;
    },

    // Remove an attribute from the State, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function (attr, options) {
        return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the State, firing `"change"`.
    clear: function (options) {
        var attrs = {};
        for (var key in this.attributes) attrs[key] = void 0;
        return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the State has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function (attr) {
        if (attr == null) return !_.isEmpty(this.changed);
        return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the State,
    // determining if there *would be* a change.
    changedAttributes: function (diff) {
        if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
        var val, changed = false;
        var old = this._changing ? this._previousAttributes : this.attributes;
        for (var attr in diff) {
            if (_.isEqual(old[attr], (val = diff[attr]))) continue;
            (changed || (changed = {}))[attr] = val;
        }
        return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function (attr) {
        if (attr == null || !this._previousAttributes) return null;
        return this._previousAttributes[attr];
    },

    // Get all of the attributes of the State at the time of the previous
    // `"change"` event.
    previousAttributes: function () {
        return _.clone(this._previousAttributes);
    },

    // Create a new State with identical attributes to this one.
    clone: function () {
        return new this.constructor(this.attributes);
    },

    // Run validation against the next complete set of State attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function (attrs, options) {
        if (!options.validate || !this.validate) return true;
        attrs = _.extend({}, this.attributes, attrs);
        var error = this.validationError = this.validate(attrs, options) || null;
        if (!error) return true;
        this.trigger('invalid', this, error, _.extend(options || {}, {validationError: error}));
        return false;
    }
});

_.extend(State.prototype, Events);

// Underscore methods that we want to implement on the State.
var stateMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

// Mix in each Underscore method as a proxy to `State#attributes`.
_.each(stateMethods, function (method) {
    State.prototype[method] = function () {
        var args = slice.call(arguments);
        args.unshift(this.attributes);
        return _[method].apply(_, args);
    };
});
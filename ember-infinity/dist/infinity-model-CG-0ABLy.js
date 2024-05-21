import ArrayProxy from '@ember/array/proxy';
import { _ as _applyDecoratedDescriptor, a as _initializerDefineProperty } from './_rollupPluginBabelHelpers-L-9AK1w0.js';
import { tracked } from '@glimmer/tracking';
import { get } from '@ember/object';
import { resolve } from 'rsvp';

class Notifier {
  constructor() {
    this.listeners = [];
  }

  /**
   * Add a callback as a listener, which will be triggered when sending
   * notifications.
   */
  addListener(listener) {
    this.listeners.push(listener);
    return () => this.removeListener(listener);
  }

  /**
   * Remove a listener so that it will no longer receive notifications.
   */
  removeListener(listener) {
    const listeners = this.listeners;
    for (let i = 0, len = listeners.length; i < len; i++) {
      if (listeners[i] === listener) {
        listeners.splice(i, 1);
        return;
      }
    }
  }

  /**
   * Notify registered listeners.
   */
  trigger(...args) {
    this.listeners.slice(0).forEach(listener => listener(...args));
  }
}

// in lieue of a decorator, lets just use Mixin/composition pattern
function addEvented(Base) {
  return class extends Base {
    on(eventName, listener) {
      return notifierForEvent(this, eventName).addListener(listener);
    }
    off(eventName, listener) {
      return notifierForEvent(this, eventName).removeListener(listener);
    }
    trigger(eventName, ...args) {
      const notifier = notifierForEvent(this, eventName);
      if (notifier) {
        notifier.trigger.apply(notifier, args);
      }
    }
  };
}
function notifierForEvent(object, eventName) {
  if (object._eventedNotifiers === undefined) {
    object._eventedNotifiers = {};
  }
  let notifier = object._eventedNotifiers[eventName];
  if (!notifier) {
    notifier = object._eventedNotifiers[eventName] = new Notifier();
  }
  return notifier;
}

function DEFAULTS(Base) {
  var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22;
  return _class = class _class extends Base {
    constructor(...args) {
      super(...args);
      /**
        Increases or decreases depending on scroll direction
         @private
        @property currentPage
        @type Integer
        @default 0
      */
      _initializerDefineProperty(this, "currentPage", _descriptor, this);
      /**
        @private
        @property extraParams
        @type Object
        @default null
      */
      _initializerDefineProperty(this, "extraParams", _descriptor2, this);
      /**
        Used as a marker for the page the route starts on
         @private
        @property firstPage
        @type Integer
        @default 0
      */
      _initializerDefineProperty(this, "firstPage", _descriptor3, this);
      /**
        @public
        @property isError
        @type Boolean
        @default false
      */
      _initializerDefineProperty(this, "isError", _descriptor4, this);
      /**
        @public
        @property isLoaded
        @type Boolean
        @default false
      */
      _initializerDefineProperty(this, "isLoaded", _descriptor5, this);
      /**
        @public
        @property loadingMore
        @type Boolean
        @default false
      */
      _initializerDefineProperty(this, "loadingMore", _descriptor6, this);
      /**
        Arbitrary meta copied over from
        the HTTP response, to maintain the
        default behavior of ember-data requests
        @type objects
        @default null
      */
      _initializerDefineProperty(this, "meta", _descriptor7, this);
      /**
        @private
        @property _perPage
        @type Integer
        @default 25
      */
      _initializerDefineProperty(this, "perPage", _descriptor8, this);
      /**
        @public
        @property reachedInfinity
        @default false
       */
      _initializerDefineProperty(this, "reachedInfinity", _descriptor9, this);
      /**
        @public
        @property store
        @default null
       */
      _initializerDefineProperty(this, "store", _descriptor10, this);
      /**
        Name of the "per page" param in the
        resource request payload
        @type {String}
        @default  "per_page"
       */
      _initializerDefineProperty(this, "perPageParam", _descriptor11, this);
      /**
        Name of the "page" param in the
        resource request payload
        @type {String}
        @default "page"
       */
      _initializerDefineProperty(this, "pageParam", _descriptor12, this);
      /**
        Path of the "total pages" param in
        the HTTP response
        @type {String}
        @default "meta.total_pages"
       */
      _initializerDefineProperty(this, "totalPagesParam", _descriptor13, this);
      /**
        Path of the "count" param in indicating
        number of records from HTTP response
        @type {String}
        @default "meta.count"
       */
      _initializerDefineProperty(this, "countParam", _descriptor14, this);
      /**
        The supported findMethod name for
        the developers Ember Data version.
        Provided here for backwards compat.
        @public
        @property storeFindMethod
        @default null
       */
      _initializerDefineProperty(this, "storeFindMethod", _descriptor15, this);
      /**
        @private
        @property _count
        @type Integer
        @default 0
      */
      _initializerDefineProperty(this, "_count", _descriptor16, this);
      /**
        @private
        @property _totalPages
        @type Integer
        @default 0
      */
      _initializerDefineProperty(this, "_totalPages", _descriptor17, this);
      /**
        @private
        @property _infinityModelName
        @type String
        @default null
      */
      _initializerDefineProperty(this, "_infinityModelName", _descriptor18, this);
      /**
        @private
        @property _firstPageLoaded
        @type Boolean
        @default false
      */
      _initializerDefineProperty(this, "_firstPageLoaded", _descriptor19, this);
      /**
        @private
        @property _increment
        @type Integer
        @default 1
      */
      _initializerDefineProperty(this, "_increment", _descriptor20, this);
      /**
        simply used for previous page scrolling abilities and passed from
        infinity-loader component and set on infinityModel
        @private
        @property _scrollable
        @type Integer
        @default null
      */
      _initializerDefineProperty(this, "_scrollable", _descriptor21, this);
      /**
        determines if can load next page or previous page (if applicable)
         @private
        @property _canLoadMore
        @type Boolean
      */
      _initializerDefineProperty(this, "_canLoadMore", _descriptor22, this);
    }
  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "currentPage", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 0;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "extraParams", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return null;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "firstPage", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 0;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "isError", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return false;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "isLoaded", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return false;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "loadingMore", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return false;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "meta", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return null;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "perPage", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 25;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, "reachedInfinity", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return false;
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, "store", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return null;
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class.prototype, "perPageParam", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 'per_page';
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class.prototype, "pageParam", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 'page';
    }
  }), _descriptor13 = _applyDecoratedDescriptor(_class.prototype, "totalPagesParam", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 'meta.total_pages';
    }
  }), _descriptor14 = _applyDecoratedDescriptor(_class.prototype, "countParam", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 'meta.count';
    }
  }), _descriptor15 = _applyDecoratedDescriptor(_class.prototype, "storeFindMethod", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return null;
    }
  }), _descriptor16 = _applyDecoratedDescriptor(_class.prototype, "_count", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 0;
    }
  }), _descriptor17 = _applyDecoratedDescriptor(_class.prototype, "_totalPages", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 0;
    }
  }), _descriptor18 = _applyDecoratedDescriptor(_class.prototype, "_infinityModelName", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return null;
    }
  }), _descriptor19 = _applyDecoratedDescriptor(_class.prototype, "_firstPageLoaded", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return false;
    }
  }), _descriptor20 = _applyDecoratedDescriptor(_class.prototype, "_increment", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 1;
    }
  }), _descriptor21 = _applyDecoratedDescriptor(_class.prototype, "_scrollable", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return null;
    }
  }), _descriptor22 = _applyDecoratedDescriptor(_class.prototype, "_canLoadMore", [tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return null;
    }
  })), _class;
}

let objectAssign = Object.assign || function objectAssign(target) {

  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  target = Object(target);
  for (var index = 1; index < arguments.length; index++) {
    var source = arguments[index];
    if (source != null) {
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
  }
  return target;
};

/**
 * determine param to set on infinityModel
 * if user passes null, then don't send query param in request
 * if user passes option, use it
 * else set to default param
 *
 * @method paramsCheck
 * @param {String} key - param name
 * @param {Object} options - parameter overrides
 * @param {Object} extendedInfinityModel - custom infinity model
 * @return {String} parameter value
 */
function paramsCheck(key, options, extendedInfinityModel) {
  const paramDefault = get(extendedInfinityModel, key);
  const paramOverride = options[key];
  if (paramOverride === null) {
    // allow user to set to null if passed into infinityRoute explicitly
    return null;
  } else if (paramOverride) {
    return paramOverride;
  } else {
    return paramDefault;
  }
}

/**
 * @method checkInstanceOf
 * @param {Ember.Array}
 * @return {Boolean}
 */
function checkInstanceOf(infinityModel) {
  if (!(infinityModel instanceof InfinityModel)) {
    throw new Error('Ember Infinity: You must pass an Infinity Model instance as the first argument');
  }
  return true;
}

/**
 * @method convertToArray
 * @param {Ember.Array}
 * @return {Array}
 */
function convertToArray(queryObject) {
  if (queryObject.slice) {
    return queryObject.slice();
  }
  return queryObject;
}

/**
  @class InfinityModel
  @namespace EmberInfinity
  @module ember-infinity/lib/infinity-model
  @extends Ember.ArrayProxy
*/
class InfinityModel extends DEFAULTS(addEvented(ArrayProxy)) {
  /**
    determines if can load next page or previous page (if applicable)
     @public
    @property canLoadMore
    @type Boolean
    @default false
    @overridable
  */
  get canLoadMore() {
    if (typeof this._canLoadMore === 'boolean') {
      return this._canLoadMore;
    }
    const {
      _count,
      _totalPages,
      currentPage,
      perPage,
      _increment
    } = this;
    const shouldCheck = _increment === 1 && currentPage !== undefined;
    if (shouldCheck) {
      if (_totalPages) {
        return currentPage < _totalPages ? true : false;
      } else if (_count) {
        return currentPage < _count / perPage ? true : false;
      }
    }
    if (this.firstPage > 1) {
      // load previous page if starting page was not 1.  Otherwise ignore this block
      return this.firstPage > 1 ? true : false;
    }
    return false;
  }
  set canLoadMore(value) {
    this._canLoadMore = value;
  }

  /**
    build the params for the next page request
    if param does not exist (user set to null or not defined) it will not be sent with request
    @private
    @method buildParams
    @return {Object} The query params for the next page of results
   */
  buildParams(increment) {
    const pageParams = {};
    let {
      perPageParam,
      pageParam
    } = this;
    if (typeof perPageParam === 'string') {
      pageParams[perPageParam] = this.perPage;
    }
    if (typeof pageParam === 'string') {
      pageParams[pageParam] = this.currentPage + increment;
    }
    return objectAssign(pageParams, this.extraParams);
  }

  /**
    abstract after-model hook, can be overridden in subclasses
    Used to keep shape for optimization
     @method afterInfinityModel
    @param {Ember.Array} newObjects the new objects added to the model
    @param {Ember.ArrayProxy} infinityModel (self)
    @return {Ember.RSVP.Promise} A Promise that resolves the new objects
    @return {Ember.Array} the new objects
   */
  afterInfinityModel(newObjects /*, infinityModel*/) {
    // override in your subclass to customize
    return resolve(newObjects);
  }

  /**
    lifecycle hooks
     @method infinityModelLoaded
   */
  infinityModelLoaded() {}

  /**
    lifecycle hooks
     @method infinityModelUpdated
   */
  infinityModelUpdated() {}
}

export { InfinityModel as I, convertToArray as a, checkInstanceOf as c, objectAssign as o, paramsCheck as p };
//# sourceMappingURL=infinity-model-CG-0ABLy.js.map

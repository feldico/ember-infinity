import ArrayProxy from '@ember/array/proxy';
import { resolve } from 'rsvp';
import { tracked } from '@glimmer/tracking';
import Notifier from '../-private/notifier';

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

/**
  @class InfinityModel
  @namespace EmberInfinity
  @module ember-infinity/lib/infinity-model
  @extends Ember.ArrayProxy
*/
export default class InfinityModel extends ArrayProxy {
  /**
    Increases or decreases depending on scroll direction

    @private
    @property currentPage
    @type Integer
    @default 0
  */
  currentPage = 0;

  /**
    @private
    @property extraParams
    @type Object
    @default null
  */
  extraParams = null;

  /**
    Used as a marker for the page the route starts on

    @private
    @property firstPage
    @type Integer
    @default 0
  */
  firstPage = 0;

  /**
    @public
    @property isError
    @type Boolean
    @default false
  */
  isError = false;

  /**
    @public
    @property isLoaded
    @type Boolean
    @default false
  */
  isLoaded = false;

  /**
    @public
    @property loadingMore
    @type Boolean
    @default false
  */
  loadingMore = false;

  /**
    Arbitrary meta copied over from
    the HTTP response, to maintain the
    default behavior of ember-data requests
    @type objects
    @default null
  */
  meta = null;

  /**
    @private
    @property _perPage
    @type Integer
    @default 25
  */
  perPage = 25;

  /**
    @public
    @property reachedInfinity
    @default false
   */
  reachedInfinity = false;

  /**
    @public
    @property store
    @default null
   */
  store = null;

  /**
    Name of the "per page" param in the
    resource request payload
    @type {String}
    @default  "per_page"
   */
  perPageParam = 'per_page';

  /**
    Name of the "page" param in the
    resource request payload
    @type {String}
    @default "page"
   */
  pageParam = 'page';

  /**
    Path of the "total pages" param in
    the HTTP response
    @type {String}
    @default "meta.total_pages"
   */
  totalPagesParam = 'meta.total_pages';

  /**
    Path of the "count" param in indicating
    number of records from HTTP response
    @type {String}
    @default "meta.count"
   */
  countParam = 'meta.count';

  /**
    The supported findMethod name for
    the developers Ember Data version.
    Provided here for backwards compat.
    @public
    @property storeFindMethod
    @default null
   */
  storeFindMethod = null;

  /**
    @private
    @property _count
    @type Integer
    @default 0
  */
  _count = 0;

  /**
    @private
    @property _totalPages
    @type Integer
    @default 0
  */
  _totalPages = 0;

  /**
    @private
    @property _infinityModelName
    @type String
    @default null
  */
  _infinityModelName = null;

  /**
    @private
    @property _firstPageLoaded
    @type Boolean
    @default false
  */
  _firstPageLoaded = false;

  /**
    @private
    @property _increment
    @type Integer
    @default 1
  */
  _increment = 1;

  /**
    simply used for previous page scrolling abilities and passed from
    infinity-loader component and set on infinityModel
    @private
    @property _scrollable
    @type Integer
    @default null
  */
  _scrollable = null;

  /**
    determines if can load next page or previous page (if applicable)

    @private
    @property _canLoadMore
    @type Boolean
  */
  @tracked _canLoadMore = null;

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

    let { _count, _totalPages, currentPage, perPage, _increment } = this;
    let shouldCheck = _increment === 1 && currentPage !== undefined;
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

  /**
    build the params for the next page request
    if param does not exist (user set to null or not defined) it will not be sent with request
    @private
    @method buildParams
    @return {Object} The query params for the next page of results
   */
  buildParams(increment) {
    const pageParams = {};
    let { perPageParam, pageParam } = this;
    if (typeof perPageParam === 'string') {
      pageParams[perPageParam] = this.perPage;
    }
    if (typeof pageParam === 'string') {
      pageParams[pageParam] = this.currentPage + increment;
    }

    return Object.assign(pageParams, this.extraParams);
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

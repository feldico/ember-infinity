import ArrayProxy from '@ember/array/proxy';
import { addEvented } from '../-private/evented';
import { DEFAULTS } from '../-private/defaults';
import { objectAssign } from '../utils';
import { resolve } from 'rsvp';

/**
  @class InfinityModel
  @namespace EmberInfinity
  @module ember-infinity/lib/infinity-model
  @extends Ember.ArrayProxy
*/
export default class InfinityModel extends DEFAULTS(addEvented(ArrayProxy)) {
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

    const { _count, _totalPages, currentPage, perPage, _increment } = this;
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
    let { perPageParam, pageParam } = this;
    if (typeof perPageParam === 'string') {
      pageParams[perPageParam] = this.perPage;
    }
    if (typeof pageParam === 'string') {
      pageParams[pageParam] = this.currentPage + increment;
    }

    return objectAssign(pageParams, this.extraParams);
  }

  /**
   * This hook is useful when you have the need to initialize the infinity model
   * with some data. For example, if you want to load the first page of data using ember-fastboot shoebox
   * you can do something like this:
   *
   * onRequestNextPage (infinityModel, modelName, params) {
   *   if (this.afterRehydration) {
          this.set('afterRehydration', false)
          this.set('preContent.meta', this.meta)
          return Promise.resolve(this.preContent);
   *   }
   *
   *   return infinityModel.store[infinityModel.storeFindMethod](
   *     modelName,
   *     params
   *   )
   * }
   *
   * Where `this.content` is the data you want to initialize the infinity model with,
   * previously stored in the shoebox, deserialized and pushed to the store, peeked in this case.
   * With this, you can avoid the first request to the server because we already have the data.
   *
   * @method onRequestNextPage
   * @param {Ember.ArrayProxy} infinityModel (self)
   * @param {String} modelName
   * @param {Object} params
   * @return {Ember.RSVP.Promise} A Promise that resolves the new objects
   */

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

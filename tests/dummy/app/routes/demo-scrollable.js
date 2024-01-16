import Route from '@ember/routing/route';
import InfinityModel from 'ember-infinity/lib/infinity-model';
import { inject as service } from '@ember/service';

class ExtendedInfinityModel extends InfinityModel {
  buildParams() {
    let params = super.buildParams(...arguments);
    params['categoryId'] = this.global.categoryId;
    return params;
  }

  afterInfinityModel(newObjects /*, infinityModel*/) {
    // smoke test.  not really doing anything.  tested at unit level
    return newObjects;
  }
}

export default class DemoScrollableRoute extends Route {
  @service global;
  @service infinity;

  model() {
    let global = this.global;
    return this.infinity.model(
      'post',
      {},
      ExtendedInfinityModel.extend({ global })
    );
  }
}

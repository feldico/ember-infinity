import Route from '@ember/routing/route';
import InfinityModel from 'ember-infinity/lib/infinity-model';
import { inject as service } from '@ember/service';

class ExtendedInfinityModel extends InfinityModel {
  buildParams() {
    let params = super.buildParams(...arguments);
    return params;
  }

  afterInfinityModel(posts) {
    this.canLoadMore = posts.length > 0;
  }
}

export default class ExtendedRoute extends Route {
  @service infinity;

  model() {
    return this.infinity.model(
      'post',
      {
        perPage: 6,
      },
      ExtendedInfinityModel
    );
  }
}

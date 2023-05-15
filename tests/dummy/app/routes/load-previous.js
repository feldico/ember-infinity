import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LoadPreviousroute extends Route {
  @service infinity;

  model({ page }) {
    return this.infinity.model('post', { startingPage: page });
  }
}

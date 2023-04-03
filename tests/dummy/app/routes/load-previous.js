import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  infinity: service(),

  model({ page }) {
    return get(this, 'infinity').model('post', { startingPage: page });
  }
});

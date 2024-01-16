import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class TopComponent extends Component {
  @service infinity;

  posts = this.infinity.model('post', { perPage: 5 });
}

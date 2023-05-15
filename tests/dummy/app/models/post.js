import Model, { attr } from '@ember-data/model';

export default class Post extends Model {
  @attr('string') name;
  @attr('string') category;
}

import { find, settled } from '@ember/test-helpers';

export default async function assertDetails(
  assert,
  { title, listLength, reachedInfinity }
) {
  let postsTitle = find('#posts-title');
  let postList = find('ul');
  let infinityLoader = find('.infinity-loader');

  await settled();

  assert.strictEqual(postsTitle.textContent, title);
  assert.strictEqual(postList.querySelectorAll('li').length, listLength);
  assert.strictEqual(
    infinityLoader.classList.contains('reached-infinity'),
    reachedInfinity
  );
}

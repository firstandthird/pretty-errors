import prettyErrors from '../pretty-errors';
import Domodule from 'domodule';
import { once, fire, findOne } from 'domassist';
import test from 'tape-rollup';

const setup = options => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `<div id="data"
    data-module="PrettyErrors"
    data-module-title="PrettyErrors"
    data-module-event="${options || ''}">
      <div data-name="title"></div>
      <button type="button" data-action="postInit">Show Title</button>
  </div>`;

  document.body.appendChild(wrapper);

  return prettyErrors.discover();
};

test('Class', assert => {
  assert.ok(prettyErrors.prototype instanceof Domodule, 'It\'s a domodule class');
  assert.end();
});

test('Pasing Error Message', assert => {
  const instance = setup('circle:create:error');

  fire(document.body, 'circle:create:error', { detail: { error: 'error' } });
  assert.equal(instance.innerText, 'error');
});

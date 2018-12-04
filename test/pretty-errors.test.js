import prettyErrors from '../pretty-errors';
import Domodule from 'domodule';
import { fire } from 'domassist';
import test from 'tape-rollup';
import ErrorRules from '../error-rules';

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

  return document.body.appendChild(wrapper);
};

test('Class', assert => {
  assert.ok(prettyErrors.prototype instanceof Domodule, 'It\'s a domodule class');
  assert.end();
});

test('Same event, not matching error message', assert => {
  const instance = setup('circle:create:error');

  prettyErrors.discover();

  fire(document.body, 'circle:create:error', { detail: { error: 'error' } });
  assert.equal(instance.innerText, 'error');
  assert.end();
});

test('Same event, matching error message', assert => {
  const instance = setup('circle:create:error');
  class CirclePrettyErrors extends prettyErrors {
    getRules() {
      return ErrorRules;
    }
  }

  CirclePrettyErrors.discover();

  fire(document.body, 'circle:create:error', { detail: { error: 'apiQuery:error' } });
  assert.equal(instance.innerText, 'Api fails');
  assert.end();
});

test('If events dont match not change inner text', assert => {
  const instance = setup('circle:create:error');

  prettyErrors.discover();

  fire(document.body, 'random-event', { detail: { error: 'error' } });
  assert.notEqual(instance.innerText, 'error');
  assert.end();
});

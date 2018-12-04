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

  return prettyErrors.discover();
};

test('Class', assert => {
  assert.ok(prettyErrors.prototype instanceof Domodule, 'It\'s a domodule class');
  assert.end();
});

test('Same event, not matching error message', assert => {
  const [instance] = setup('circle:create:error');

  fire(document.body, 'circle:create:error', { detail: { error: 'error' } });
  assert.equal(instance.el.innerText, 'error');
  assert.end();
});

test('Same event, matching error message', assert => {
  const [instance] = setup('circle:create:error');

  instance.getErrors = () => ErrorRules;

  fire(document.body, 'circle:create:error', { detail: { error: 'apiQuery:error' } });
  assert.equal(instance.el.innerText, 'Api fails');
  assert.end();
});

test('If events dont match not change inner text', assert => {
  const [instance] = setup('circle:create:error');

  fire(document.body, 'random-event', { detail: { error: 'error' } });
  assert.notEqual(instance.el.innerText, 'error');
  assert.end();
});

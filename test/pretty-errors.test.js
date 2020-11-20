import PrettyErrors from '..';
import Domodule from 'domodule';
import { fire } from 'domassist';

const RULES = [
  {
    regexp: /apiQuery:error/gi,
    format: match => 'Api fails'
  },
];

const setup = options => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `<div
    data-module="PrettyErrors"
    data-module-title="PrettyErrors"
    data-module-event="${options || ''}">
      <div data-name="title"></div>
      <button type="button" data-action="postInit">Show Title</button>
  </div>`;

  document.body.innerHTML = '';
  document.body.appendChild(wrapper);
  return PrettyErrors.discover();
};

test('Class', () => {
  expect(PrettyErrors.prototype instanceof Domodule).toBeTruthy();
});

test('Same event, not matching error message', () => {
  const [instance] = setup('circle:create:error');

  fire(document.body, 'circle:create:error', { detail: { error: 'error' } });
  expect(instance.el.innerHTML).toMatch('error');
});

test('Same event, matching error message', () => {
  const [instance] = setup('circle:create:error');

  instance.getRules = () => RULES;

  fire(document.body, 'circle:create:error', { detail: { error: 'apiQuery:error' } });
  expect(instance.el.innerHTML).toMatch('Api fails');
});

test('Multiple events, same error type', () => {
  const [instance] = setup('circle:create:error, circle:error, api:Error');

  instance.getRules = () => RULES;

  fire(document.body, 'circle:create:error', { detail: { error: 'circle not create' } });
  expect(instance.el.innerHTML).toMatch('circle not create');

  fire(document.body, 'circle:error', { detail: { error: 'error' } });
  expect(instance.el.innerHTML).toMatch('error');

  fire(document.body, 'api:Error', { detail: { error: 'apiQuery:error' } });
  expect(instance.el.innerHTML).toMatch('Api fails');
});

test('If events dont match not change inner text', () => {
  const [instance] = setup('circle:create:error');

  fire(document.body, 'random-event', { detail: { error: 'error' } });
  expect(instance.el.innerHTML).not.toMatch('error');
});

test('Required event', () => {
  const wrongEl = document.createElement('div');

  expect(() => {
    new PrettyErrors(wrongEl);
  }).toThrow();
});

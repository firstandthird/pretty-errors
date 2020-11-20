import { on, html, removeClass, addClass } from 'domassist';
import Domodule from 'domodule';

export default class PrettyErrors extends Domodule {
  get required() {
    return {
      options: ['event']
    };
  }

  getRules() {
    return [];
  }

  getEvents() {
    return this.options.event.split(',');
  }

  postInit() {
    const events = this.getEvents();

    events.forEach(event => {
      const typeEvent = event.trim();
      on(document.body, typeEvent, this.onError.bind(this));
      on(document.body, `${typeEvent}:hide`, this.onHide.bind(this));
    });
  }

  onError(event) {
    let message = event.detail.error;
    const rules = this.getRules();

    rules.some(er => {
      const match = er.regexp.exec(message);
      er.regexp.lastIndex = 0;

      if (match) {
        message = er.format(match);
      }

      return !!match;
    });

    removeClass(this.el, 'hide');
    html(this.el, message);
  }

  onHide() {
    addClass(this.el, 'hide');
  }
}

Domodule.register('PrettyErrors', PrettyErrors);

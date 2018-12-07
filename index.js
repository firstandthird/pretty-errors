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

  postInit() {
    const events = this.options.event;
    events.split(', ').forEach(event => {
      on(document.body, event, this.onError.bind(this));
      on(document.body, `${event}:hide`, this.onHide.bind(this));
    });
  }

  onError(event) {
    let message = event.detail.error;
    const rules = this.getRules();

    if (rules !== []) {
      rules.some(er => {
        const match = er.regexp.exec(message);
        er.regexp.lastIndex = 0;

        if (match) {
          message = er.format(match);
        }

        return !!match;
      });
    }

    removeClass(this.el, 'hide');
    html(this.el, message);
  }

  onHide() {
    addClass(this.el, 'hide');
  }
}

Domodule.register('PrettyErrors', PrettyErrors);

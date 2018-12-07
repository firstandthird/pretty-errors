import { on, html, removeClass, addClass } from 'domassist';
import Domodule from 'domodule';

export default class PrettyErrors extends Domodule {
  get required() {
    return {
      options: ['event']
    };
  }

  getRules() {
    return null;
  }

  getErrors() {
    return null;
  }

  postInit() {
    const errors = this.getErrors();

    if (errors) {
      errors.forEach((error) => {
        on(document.body, error, this.onError.bind(this));
        on(document.body, `${error}:hide`, this.onHide.bind(this));
      });
    } else {
      on(document.body, this.options.event, this.onError.bind(this));
      on(document.body, `${this.options.event}:hide`, this.onHide.bind(this));
    }
  }

  onError(event) {
    let message = event.detail.error;
    const rules = this.getRules();

    if (rules) {
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

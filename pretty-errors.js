import { on, html, removeClass, addClass } from 'domassist';
import Domodule from 'domodule';

export default class PrettyErrors extends Domodule {
  getRules() {
    return null;
  }

  getRequired() {
    return {
      options: ['event']
    };
  }

  postInit() {
    on(document.body, this.options.event, this.onError.bind(this));
    on(document.body, `${this.options.event}:hide`, this.onHide.bind(this));
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

    this.show();
    html(this.el, message);
  }

  onHide() {
    addClass(this.el, 'hide');
  }

  show() {
    removeClass(this.el, 'hide');
  }
}

Domodule.register('PrettyErrors', PrettyErrors);

import { on, html, addClass } from 'domassist';
import Domodule from 'domodule';
// import ErrorRules from './error-rules';

export default class PrettyErrors extends Domodule {
  getRules() {
    return null;
  }

  postInit() {
    on(document.body, this.options.event, this.onError.bind(this));
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

    addClass(this.el, 'visible');
    html(this.el, message);
  }
}

Domodule.register('PrettyErrors', PrettyErrors);

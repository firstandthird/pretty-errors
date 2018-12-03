import { on, html } from 'domassist';
import Domodule from 'domodule';
import ErrorRules from './error-rules';

class ErrorHandle extends Domodule {

  postInit() {
    on(document.body, this.options.event, this.onError.bind(this));
  }

  onError(event) {
    let message = event.detail.error;

    ErrorRules.some(er => {
      const match = er.regexp.exec(message);
      er.regexp.lastIndex = 0;

      if (match) {
        message = er.format(match);
      }

      return !!match;
    });

    html(this.el, message);
  }
}

Domodule.register('ErrorHandle', ErrorHandle);

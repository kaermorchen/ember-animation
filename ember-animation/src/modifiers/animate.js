import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

function cleanup(instance) {
  let { animation } = instance;

  if (animation) {
    animation.cancel();

    instance.animation = null;
  }
}

export default class AnimateModifier extends Modifier {
  animation = null;

  modify(element, positional, named) {
    this.initAnimation(element, positional, named);

    registerDestructor(this, cleanup);
  }

  initAnimation = (element, [keyframes, timing], { onFinish, onCancel }) => {
    this.animation = element.animate(keyframes, timing);

    if (onFinish) {
      this.animation.finished.then(() => onFinish());
    }

    if (onCancel) {
      this.animation.finished.catch((error) => onCancel(error));
    }
  };
}

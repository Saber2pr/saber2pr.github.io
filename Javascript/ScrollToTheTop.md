```js
import { tween } from 'popmotion'; // 8.7.3
import createPageRef from 'scroll-doc';

import * as easing from '@popmotion/easing';

export const pageRef = createPageRef();

export const goTop = (top = 0, cb?: Function) => {
  tween({ from: pageRef.scrollTop, to: top, ease: easing.easeInOut }).start((v: number) => {
    pageRef.scrollTop = v;
    if (v === 0) {
      cb && cb();
    }
  });
};
export const goTopQuick = (top = 0) => {
  pageRef.scrollTop = top;
};

export function getElementTop(elem: HTMLElement) {
  let elemTop = elem.offsetTop;
  elem = elem.offsetParent as HTMLElement;
  while (elem != null) {
    elemTop += elem.offsetTop;
    elem = elem.offsetParent as HTMLElement;
  }
  return elemTop;
}

export const goElementTop = (elem: HTMLElement, cb?: Function) => {
  const eleTop = getElementTop(elem);
  goTop(eleTop, cb);
};
```
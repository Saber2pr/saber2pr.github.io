```ts
import moment from 'moment';

/**
 * 本地缓存，时效1小时
 */
export class LocalCache<K extends string, V> {
  constructor() {
    if (/LocalCache_clear/.test(window.location.search)) {
      localStorage.clear();
    }
  }

  set(key: K, value: V): void {
    localStorage.setItem(this.getCacheKeyId(key), JSON.stringify(value));
  }

  get(key: K) {
    const str = localStorage.getItem(this.getCacheKeyId(key));
    if (!str) return;

    const ret = JSON.parse(str);

    setTimeout(() => {
      // 重置缓存
      this.clean(key, moment().format('DD'));
      this.clean(key, moment().subtract(1, 'day').format('DD'));
      this.set(key, ret);
    });

    return ret;
  }

  private getCacheKeyId = (key: string) => moment().format('YYYY_MM_DD_H_') + key;

  /**
   * 清除 key 当天的所有缓存
   */
  private clean(key: K, day: string) {
    const prefix = moment().format('YYYY_MM');
    for (let i = 0; i < 24; i++) {
      const ckey = `${prefix}_${day}_${i}_${key}`;
      localStorage.removeItem(ckey);
    }
  }
}

```

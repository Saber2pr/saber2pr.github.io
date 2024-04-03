Used for operating records, providing revocation and anti-revocation.
```js
const recorder = {
    record: [],
    max: 5,
    currentIndex: 0,
    push(...values) {
        this.record.push(...values)
        this.clean()
    },
    clean() {
        while (this.record.length > this.max) {
            this.record.shift()
        }
        this.currentIndex = this.record.length - 1
    },
    forward() {
        this.currentIndex =
            this.currentIndex < this.record.length - 1
                ? this.currentIndex + 1
                : this.currentIndex
        return this.record[this.currentIndex]
    },
    back() {
        this.currentIndex =
            this.currentIndex > 0
                ? this.currentIndex - 1
                : this.currentIndex
        return this.record[this.currentIndex]
    }
}
```
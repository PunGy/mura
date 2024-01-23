/**
 * Performant stack of unique values with possibility to remove from the middle
 */
export class UniqueStack<T> {
  //                 value,   id
  private valIdMap: Map<T, number> = new Map()
  //                    id       doubly linked list
  private vault: Record<number, { prev: number, next: number | null, val: T }> = {}
  // last id
  private last = -1

  peek() {
    if (this.last < 0) return null
    return this.vault[this.last]!.val
  }
  push(val: T) {
    if (this.valIdMap.has(val)) return;

    const prev = this.last
    this.last = prev + 1
    this.vault[this.last] = { prev, val, next: null }

    // if we have values behind
    if (this.last > 0) {
      // add the link of the current last value to the previous
      this.vault[prev].next = this.last
    }

    this.valIdMap.set(val, this.last)
    return val
  }

  delete(val: T) {
    if (!this.valIdMap.has(val)) return false

    const id = this.valIdMap.get(val)!
    this.valIdMap.delete(val)

    const entry = this.vault[id]
    // if entry do have the next - move the link from the current to the previous (and previous can be -1)
    if (entry.next !== null) {
      this.vault[entry.next].prev = entry.prev
    }
    // if entry do have the previous - move the link from the previous to the next (and next can be null)
    if (entry.prev >= 0) {
      this.vault[entry.prev].next = entry.next
    }
    // if the entry is the last - update the last
    if (entry.next === null) {
      this.last = entry.prev
    }

    delete this.vault[id]
    return true
  }

  pop() {
    if (this.last < 0) return null
    const entry = this.vault[this.last]

    if (entry.prev > -1) {
      this.vault[entry.prev].next = null
    }
    this.valIdMap.delete(entry.val)
    delete this.vault[this.last]

    return entry
  }

  forEach(fn: (val: T, index: number) => void) {
    let entryId = this.last
    while (entryId > -1) {
      const entry = this.vault[entryId]
      fn(entry.val, entryId)
      entryId = entry.prev
    }
  }
}

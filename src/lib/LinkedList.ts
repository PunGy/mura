export class ListNode<T> {
    value: T
    next: ListNode<T> | null = null
    prev: ListNode<T> | null = null

    constructor(value: T) {
        this.value = value
    }
}
export class LinkedList<T> {
    private head: ListNode<T> | null = null
    private tail: ListNode<T> | null = null
    private size: number = 0

    isEmpty() {
        if (this.size === 0) {
            const empty = this.head === null && this.tail === null
            if (empty) {
                return true
            } else {
                throw new Error('Signature of the linked list is broken!')
            }
        } else {
            const empty = this.head === null && this.tail === null
            if (empty) {
                throw new Error('Signature of the linked list is broken!')
            } else {
                return false
            }
        }
    }

    pushBack(val: T) {
        const node = new ListNode(val)
        if (this.isEmpty()) {
            this.head = node
            this.tail = node
        } else {
            node.prev = this.tail
            this.tail!.next = node
            this.tail = node
        }
        this.size++
        return this
    }

    pushFront(val: T) {
        const node = new ListNode(val)
        if (this.isEmpty()) {
            this.head = node
            this.tail = node
        } else {
            node.next = this.head
            this.head = node
        }
        this.size++
        return this
    }

    peekTail() {
        return this.tail
    }
    peekHead() {
        return this.head
    }

    popBack() {
        if (this.isEmpty()) return
        const tail = this.tail!
        this.tail = tail.prev
        if (this.tail) this.tail.next = null
        this.size--
        return tail
    }

    popFront() {
        if (this.isEmpty()) return
        const head = this.head!
        this.head = head.next
        if (this.head) this.head.prev = null
        this.size--
        return head
    }

    encycle() {
        if (this.size < 2) return this
        this.head!.prev = this.tail
        this.tail!.next = this.head
        return this
    }

    cursor: ListNode<T> | null = null
    next() {
        if (this.cursor === null) this.cursor = this.head
        const node = this.cursor
        this.cursor = this.cursor?.next ?? null
        return node
    }
    prev() {
        if (this.cursor === null) this.cursor = this.head
        const node = this.cursor
        this.cursor = this.cursor?.prev ?? null
        return node
    }
}

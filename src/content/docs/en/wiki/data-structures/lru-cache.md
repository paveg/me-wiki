---
title: LRU Cache
description: Designing an O(1) cache with HashMap + Doubly Linked List
sidebar:
  order: 1
---

## Overview

An LRU Cache (Least Recently Used Cache) is a fixed-capacity data structure that **evicts the least recently accessed entry when full**. It is widely used in real systems — OS page replacement, database buffer pools, web browser caches, and more.

In interviews it typically appears as "design a cache where Get and Put both run in $O(1)$", and the canonical solution combines a **HashMap with a Doubly Linked List**.

## Core Data Structure: HashMap + Doubly Linked List

The HashMap provides $O(1)$ key-to-node lookup, while the doubly linked list maintains access order. The head of the list represents the most recently used entry; the tail represents the least recently used.

```moonmaid
flowchart LR { HM["HashMap key->Node*"] -> N1 HM -> N2 HM -> N3 H["Head (sentinel)"] -> N1["Node A key=1, val=10"] N1 -> N2["Node B key=2, val=20"] N2 -> N3["Node C key=3, val=30"] N3 -> T["Tail (sentinel)"] }
```

**Head side = most recent, Tail side = least recent.** Head and Tail are sentinel nodes that hold no data[^1].

[^1]: Sentinel nodes eliminate `nil` checks when inserting or removing at the boundaries of the list, making the code significantly simpler.

### Get / Put Operations

```moonmaid
flowchart TD { G1["Get(key)"] -> G2{"key in cache?"} G2 -> |"Yes"| G3["Remove node from list"] G3 -> G4["insertHead (mark as most recent)"] G4 -> G5["Return val"] G2 -> |"No"| G6["Return -1"] P1["Put(key, val)"] -> P2{"key in cache?"} P2 -> |"Yes"| P3["Update val"] P3 -> P4["remove then insertHead"] P2 -> |"No"| P5["Create new Node"] P5 -> P6["Add to cache + insertHead"] P6 -> P7{"Over capacity?"} P7 -> |"Yes"| P8["Remove tail.prev, Delete from cache"] P7 -> |"No"| P9["Done"] }
```

## Complexity

| Operation | Time | Space |
|---|---|---|
| Get | $O(1)$ | — |
| Put | $O(1)$ | — |
| Overall | — | $O(\text{capacity})$ |

**Why $O(1)$:**

- **Get**: HashMap lookup is $O(1)$. Removing a node and re-inserting at the head only involves pointer reassignment — $O(1)$
- **Put**: Same as above. Eviction on overflow accesses `tail.prev` directly — $O(1)$

## Why HashMap + Doubly Linked List?

| Alternative | Get | Put (update) | Evict (LRU) | Issue |
|---|---|---|---|---|
| Array + HashMap | $O(1)$ | $O(n)$ | $O(n)$ | Moving elements requires shifting |
| Singly Linked List + HashMap | $O(1)$ | $O(n)$ | $O(1)$ | Cannot access `prev`, so remove is $O(n)$ |
| OrderedDict (Python) | $O(1)$ | $O(1)$ | $O(1)$ | Language-specific built-in; interviews expect you to understand internals |
| **Doubly Linked List + HashMap** | **$O(1)$** | **$O(1)$** | **$O(1)$** | **All operations $O(1)$** |

A doubly linked list allows direct access to `node.prev`, which means **any node can be removed in $O(1)$**. This is the key advantage over a singly linked list.

## Applied Problems

### [146. LRU Cache](https://leetcode.com/problems/lru-cache/)

Implement an LRU Cache with capacity `capacity` where both `Get` and `Put` run in $O(1)$.

```go
type Node struct {
 key, val   int
 prev, next *Node
}

type LRUCache struct {
 cap        int
 cache      map[int]*Node
 head, tail *Node
}

func Constructor(capacity int) LRUCache {
 head := &Node{}
 tail := &Node{}
 head.next = tail
 tail.prev = head
 return LRUCache{cap: capacity, cache: make(map[int]*Node, capacity), head: head, tail: tail}
}

func (l *LRUCache) remove(node *Node) {
 node.prev.next = node.next
 node.next.prev = node.prev
}

func (l *LRUCache) insertHead(node *Node) {
 node.next = l.head.next
 node.prev = l.head
 l.head.next.prev = node
 l.head.next = node
}

func (this *LRUCache) Get(key int) int {
 if node, ok := this.cache[key]; ok {
  this.remove(node)
  this.insertHead(node)
  return node.val
 }
 return -1
}

func (this *LRUCache) Put(key int, value int) {
 if node, ok := this.cache[key]; ok {
  node.val = value
  this.remove(node)
  this.insertHead(node)
  return
 }
 node := &Node{key: key, val: value}
 this.cache[key] = node
 this.insertHead(node)
 if len(this.cache) > this.cap {
  lru := this.tail.prev
  this.remove(lru)
  delete(this.cache, lru.key)
 }
}
```

**Key points:**

- **Sentinel nodes**: `head` and `tail` are dummy nodes holding no data. They eliminate `nil` checks when the list is empty or when operating at boundaries
- **Why Node stores key**: During eviction we remove `tail.prev` from the list, but we also need to `delete(this.cache, lru.key)` from the HashMap. Without the key stored in the Node, we wouldn't know which HashMap entry to delete[^2]
- **remove + insertHead**: Both Get and Put move the accessed node to the most-recent position (right after Head) by first removing it, then inserting at the head

[^2]: This is a frequently asked interview question. When asked "why does the Node store the key?", the answer is: it's needed to delete the corresponding HashMap entry during eviction.

## How to Recognize

- "Design a cache" or "fixed-capacity key-value store"
- $O(1)$ Get and Put are stated requirements
- "Evict the oldest / least recently used data" (LRU policy)
- System design interviews asking "how would you implement a cache layer?"

## Common Mistakes

1. **Not using sentinel nodes**: Without them, `head` / `tail` can be `nil`, leading to complex branching and bugs
2. **Forgetting to delete from HashMap**: During eviction, calling `remove(lru)` without `delete(this.cache, lru.key)` leaves ghost entries in the map
3. **Creating duplicate nodes on existing-key Put**: When a key already exists, just update the value and move the node. Creating a new Node breaks capacity tracking
4. **Wrong pointer update order in insertHead**: Four pointers must be reassigned in the correct sequence or the list breaks. Draw it on paper to verify

## Related

- [Linked List](/en/wiki/data-structures/linked-list/) — Linked list reversal, merge, and cycle detection
- [DFS (Depth-First Search)](/en/wiki/algorithms/dfs/) — Fundamental graph/grid traversal technique
- [Sliding Window](/en/wiki/algorithms/sliding-window/) — A different exploration pattern for arrays
- [BFS (Breadth-First Search)](/en/wiki/algorithms/bfs/) — Breadth-first traversal

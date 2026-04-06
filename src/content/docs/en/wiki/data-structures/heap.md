---
title: Heap / Priority Queue
description: A complete binary tree for efficiently retrieving min/max from a dynamic collection
sidebar:
  order: 2
---

## Overview

A Heap is a **complete binary tree satisfying the heap property**. In a min-heap, every parent node is less than or equal to its children, so the root holds the minimum value. A Priority Queue is the **abstract data type** — "efficiently retrieve the highest-priority element" — and the heap is its canonical implementation.

In Go, you use heaps by implementing the interface provided by the `container/heap` package.

In coding interviews, heaps appear whenever you need to **efficiently retrieve the min or max from a dynamically changing collection**.

## Core Idea

- **Insert**: Add to the end, then swap upward comparing with parent (bubble up) — $O(\log n)$
- **Extract min/max**: Remove the root, move the last element to the root, then swap downward (bubble down) — $O(\log n)$
- **Peek**: Just read the root — $O(1)$

```moonmaid
flowchart TD { I1["Add new element at the end"] -> I2{"Parent > child?"} I2 -> |"Yes"| I3["Swap with parent (bubble up)"] I3 -> I2 I2 -> |"No"| I4["Insert Done"] E1["Remove root"] -> E2["Move last element to root"] E2 -> E3{"Parent > child?"} E3 -> |"Yes"| E4["Swap with smallest child (bubble down)"] E4 -> E3 E3 -> |"No"| E5["Extract Done"] }
```

## Go's container/heap

To use `container/heap`, implement these 5 methods:

```go
type Interface interface {
    sort.Interface          // Len, Less, Swap
    Push(x any)             // add element
    Pop() any               // remove and return the last element
}
```

**Reusable IntHeap template:**

```go
type IntHeap []int

func (h IntHeap) Len() int            { return len(h) }
func (h IntHeap) Less(i, j int) bool  { return h[i] < h[j] } // min-heap
func (h IntHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *IntHeap) Push(x any)         { *h = append(*h, x.(int)) }
func (h *IntHeap) Pop() any {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[:n-1]
    return x
}
```

:::caution
`Push` and `Pop` must use **pointer receivers**. With value receivers, modifications to the underlying slice won't be visible to the caller.
:::

## Complexity

| Operation | Time |
|---|---|
| Insert | $O(\log n)$ |
| Extract min/max | $O(\log n)$ |
| Peek | $O(1)$ |
| Build heap | $O(n)$ |

## Applied Problems

### [23. Merge K Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) — Hard

Merge k sorted linked lists into one sorted list.

**Key insight**: Use a min-heap of size k. Always extract the smallest node, then push its next node if it exists. With $N$ total nodes, each heap operation is $O(\log k)$, giving $O(N \log k)$ overall.

```moonmaid
flowchart TD { S["Push head of each list into min-heap"] -> L{"Heap empty?"} L -> |"No"| P["Pop smallest node"] P -> A["Append to result list"] A -> N{"node.Next != nil?"} N -> |"Yes"| PU["Push node.Next"] PU -> L N -> |"No"| L L -> |"Yes"| D["Done"] }
```

```go
// Definition for singly-linked list.
// type ListNode struct {
//     Val  int
//     Next *ListNode
// }

type ListNodeHeap []*ListNode

func (h ListNodeHeap) Len() int            { return len(h) }
func (h ListNodeHeap) Less(i, j int) bool  { return h[i].Val < h[j].Val }
func (h ListNodeHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *ListNodeHeap) Push(x any)         { *h = append(*h, x.(*ListNode)) }
func (h *ListNodeHeap) Pop() any {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[:n-1]
    return x
}

func mergeKLists(lists []*ListNode) *ListNode {
    h := &ListNodeHeap{}
    for _, l := range lists {
        if l != nil {
            heap.Push(h, l)
        }
    }
    dummy := &ListNode{}
    curr := dummy
    for h.Len() > 0 {
        node := heap.Pop(h).(*ListNode)
        curr.Next = node
        curr = curr.Next
        if node.Next != nil {
            heap.Push(h, node.Next)
        }
    }
    return dummy.Next
}
```

**Key points:**

- The heap size is always at most $k$, so each Push/Pop is $O(\log k)$
- Guard against `nil` lists before pushing into the heap
- Using a dummy head simplifies result list construction

---

### [295. Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) — Hard

Find the median in real time from a data stream.

**Key insight — Dual Heap**: Maintain a **max-heap** (`lo`) for the lower half and a **min-heap** (`hi`) for the upper half. Keep their sizes within 1 of each other, and the median is always available from the heap roots in $O(1)$.

```moonmaid
flowchart LR { L1["lo max-heap: 5"] -> L2["3"] -> L3["1"] R1["hi min-heap: 8"] -> R2["10"] -> R3["12"] L1 -> |"max of lo <= min of hi"| R1 M["Median = (5 + 8) / 2 = 6.5"] }
```

```go
type MaxHeap []int

func (h MaxHeap) Len() int            { return len(h) }
func (h MaxHeap) Less(i, j int) bool  { return h[i] > h[j] }
func (h MaxHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MaxHeap) Push(x any)         { *h = append(*h, x.(int)) }
func (h *MaxHeap) Pop() any {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[:n-1]
    return x
}

type MinHeap []int

func (h MinHeap) Len() int            { return len(h) }
func (h MinHeap) Less(i, j int) bool  { return h[i] < h[j] }
func (h MinHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x any)         { *h = append(*h, x.(int)) }
func (h *MinHeap) Pop() any {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[:n-1]
    return x
}

type MedianFinder struct {
    lo *MaxHeap // max-heap: lower half
    hi *MinHeap // min-heap: upper half
}

func Constructor() MedianFinder {
    return MedianFinder{lo: &MaxHeap{}, hi: &MinHeap{}}
}

func (mf *MedianFinder) AddNum(num int) {
    heap.Push(mf.lo, num)
    // move max of lower half to upper half
    heap.Push(mf.hi, heap.Pop(mf.lo))
    // balance: lower half should be >= upper half in size
    if mf.lo.Len() < mf.hi.Len() {
        heap.Push(mf.lo, heap.Pop(mf.hi))
    }
}

func (mf *MedianFinder) FindMedian() float64 {
    if mf.lo.Len() > mf.hi.Len() {
        return float64((*mf.lo)[0])
    }
    return float64((*mf.lo)[0]+(*mf.hi)[0]) / 2.0
}
```

**Key points:**

- `AddNum` always flows elements through `lo` then `hi` then rebalances. This guarantees max of `lo` is always less than or equal to min of `hi`
- We maintain `lo.Len() >= hi.Len()`, so when the total count is odd the median is `lo`'s root
- Each `AddNum` performs at most 3 heap operations — $O(\log n)$. `FindMedian` is $O(1)$

## How to Recognize

- "k-th largest / smallest"
- "merge k sorted lists"
- "median" from dynamic data
- "top k frequent"
- Running min/max from a stream

## Common Mistakes

1. **Go's `container/heap`**: Implementing `Push` / `Pop` with value receivers — changes to the slice won't propagate to the caller
2. **Dual heap balancing direction**: Getting confused about which heap should be larger breaks the median retrieval logic
3. **Heap vs sorting**: If you only need top-k once from static data, sorting may be simpler. Heaps shine when data arrives dynamically

## Related

- [LRU Cache](/en/wiki/data-structures/lru-cache/) — Cache design with HashMap + Doubly Linked List
- [Greedy](/en/wiki/algorithms/greedy/) — Strategy of accumulating locally optimal choices
- [Sliding Window](/en/wiki/algorithms/sliding-window/) — Array exploration pattern

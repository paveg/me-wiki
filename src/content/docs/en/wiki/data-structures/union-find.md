---
title: Union-Find (Disjoint Set Union)
description: Efficient data structure for dynamic connected component tracking
sidebar:
  order: 4
---

## Overview

Union-Find (also called Disjoint Set Union / DSU) manages a collection of elements partitioned into **disjoint subsets**. It provides two primary operations:

- **Find**: Determine which set an element belongs to (returns the root)
- **Union**: Merge two sets into one

It efficiently answers "are these two nodes in the same connected component?" as edges are added dynamically.

## Core Idea

Each set is represented as a **tree**, with the tree's root serving as the set's representative.

- **Find**: Follow parent pointers up to the root
- **Union**: Find the roots of two elements, make one root a child of the other

```moonmaid
flowchart TD { A1["Before: 1 (root)"] -> B1["2"] A1 -> C1["3"] D1["Before: 4 (root)"] -> E1["5"] A2["After Union(3,5): 1 (root)"] -> B2["2"] A2 -> C2["3"] A2 -> D2["4"] D2 -> E2["5"] }
```

## Optimizations

### Path Compression

During Find, **reattach every visited node directly to the root**. Subsequent Find calls on the same nodes become nearly $O(1)$.

```go
// Path compression: flatten tree during Find
func (uf *UnionFind) Find(x int) int {
    if uf.parent[x] != x {
        uf.parent[x] = uf.Find(uf.parent[x])
    }
    return uf.parent[x]
}
```

### Union by Rank

During Union, **attach the shorter tree under the taller tree**. This prevents the tree from growing unnecessarily deep.

```go
// Union by rank: attach shorter tree under taller tree
func (uf *UnionFind) Union(x, y int) bool {
    rx, ry := uf.Find(x), uf.Find(y)
    if rx == ry {
        return false // already in the same set
    }
    if uf.rank[rx] < uf.rank[ry] {
        rx, ry = ry, rx
    }
    uf.parent[ry] = rx
    if uf.rank[rx] == uf.rank[ry] {
        uf.rank[rx]++
    }
    return true
}
```

### Combined Effect

With both optimizations, each operation runs in **$O(\alpha(n))$** — where $\alpha$ is the inverse Ackermann function, which grows so slowly that it is effectively $O(1)$ for all practical input sizes.

## Template

```go
type UnionFind struct {
    parent []int
    rank   []int
    count  int // number of disjoint sets
}

func NewUnionFind(n int) *UnionFind {
    parent := make([]int, n)
    rank := make([]int, n)
    for i := range parent {
        parent[i] = i
    }
    return &UnionFind{parent: parent, rank: rank, count: n}
}

func (uf *UnionFind) Find(x int) int {
    if uf.parent[x] != x {
        uf.parent[x] = uf.Find(uf.parent[x]) // path compression
    }
    return uf.parent[x]
}

func (uf *UnionFind) Union(x, y int) bool {
    rx, ry := uf.Find(x), uf.Find(y)
    if rx == ry {
        return false
    }
    // union by rank
    if uf.rank[rx] < uf.rank[ry] {
        rx, ry = ry, rx
    }
    uf.parent[ry] = rx
    if uf.rank[rx] == uf.rank[ry] {
        uf.rank[rx]++
    }
    uf.count--
    return true
}

func (uf *UnionFind) Connected(x, y int) bool {
    return uf.Find(x) == uf.Find(y)
}
```

## Complexity

| Operation | Time | Notes |
|---|---|---|
| Find | $O(\alpha(n))$ | With path compression + union by rank |
| Union | $O(\alpha(n))$ | Same as above |
| Initialization | $O(n)$ | |
| Space | $O(n)$ | parent + rank arrays |

$\alpha(n)$ is the inverse Ackermann function. For $n < 2^{65536}$, $\alpha(n) \le 4$, so it is effectively constant time in practice.

## Union-Find vs DFS/BFS

| | Union-Find | DFS/BFS |
|---|---|---|
| Graph format | Edge list | Adjacency list / grid |
| Dynamic edge insertion | **Efficient** | Must re-traverse each time |
| Component count | `count` field in $O(1)$ | $O(V+E)$ each time |
| Shortest path | Not supported | BFS can do it |
| Cycle detection | Union returns `false` | DFS can do it |
| Implementation simplicity | Easy to template | DFS is more intuitive for grids |

**When to choose:** Use Union-Find when edges arrive dynamically or are processed offline in batch. Use DFS/BFS for grid traversal or when shortest paths are needed.

## Applied Problems

### [547. Number of Provinces](https://leetcode.com/problems/number-of-provinces/)

Given $n$ cities and an adjacency matrix `isConnected`, cities that are directly or indirectly connected form a "province". Find the number of provinces.

**Key insight:** Treat each city as a node and each connection as an edge. Add all edges to Union-Find. The final number of disjoint sets is the answer.

```go
func findCircleNum(isConnected [][]int) int {
    n := len(isConnected)
    uf := NewUnionFind(n)
    for i := 0; i < n; i++ {
        for j := i + 1; j < n; j++ {
            if isConnected[i][j] == 1 {
                uf.Union(i, j)
            }
        }
    }
    return uf.count
}
```

### [684. Redundant Connection](https://leetcode.com/problems/redundant-connection/)

A tree has one extra edge added, creating a cycle. Find and return the edge that can be removed to restore the tree.

**Key insight:** Process edges sequentially. When Union returns `false` (both endpoints already in the same set), that edge created the cycle — it is the redundant one.

```go
func findRedundantConnection(edges [][]int) []int {
    n := len(edges)
    uf := NewUnionFind(n + 1) // nodes are 1-indexed
    for _, e := range edges {
        if !uf.Union(e[0], e[1]) {
            return e
        }
    }
    return nil
}
```

**Notes:**

- Nodes are 1-indexed, so we create `NewUnionFind(n + 1)`
- The problem guarantees exactly one redundant edge, so `return nil` is unreachable

## How to Recognize

- "**Connected components**", "**groups**", "**merge**", "**same group**"
- Edges are **added dynamically**
- "Find the edge that creates a cycle"
- "Minimum spanning tree" (Union-Find is used internally by Kruskal's algorithm)
- Problems solvable by DFS/BFS but given as an edge list — Union-Find is often more natural

## Common Mistakes

1. **Forgetting initialization**: Not setting `parent[i] = i` breaks Find
2. **1-indexed nodes**: When nodes start from 1, allocate array size `n+1`
3. **Reading `parent` directly instead of calling Find**: Before path compression, `parent[x]` may not be the root. Always use `Find(x)`
4. **Ignoring Union's return value**: For cycle detection, `false` carries critical information

## Related

- [DFS (Depth-First Search)](/en/wiki/algorithms/dfs/) — Alternative approach for connected components and grid traversal
- [BFS (Breadth-First Search)](/en/wiki/algorithms/bfs/) — Use when shortest paths are needed
- [Binary Tree / BST](/en/wiki/data-structures/binary-tree/) — Fundamentals of tree structures

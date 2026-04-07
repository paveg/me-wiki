---
title: Pattern Recognition
description: Identify the right algorithm from problem statement keywords
sidebar:
  order: 1
---

## Problem → Pattern Decision Flow

```moonmaid
flowchart TD { A{"Array/String problem?"} -> |"Yes"| B{"Contiguous subsequence?"} A -> |"No"| C{"Graph/Tree problem?"} B -> |"Yes"| D{"Fixed window size?"} B -> |"No"| E{"Sorted input?"} D -> |"Yes"| F["Sliding Window (fixed)"] D -> |"No"| G["Sliding Window (variable)"] E -> |"Yes"| H["Two Pointers / Binary Search"] E -> |"No"| I{"Seeking optimum?"} I -> |"Yes"| J["Dynamic Programming"] I -> |"No"| K["HashMap / Greedy"] C -> |"Yes"| L{"Shortest path?"} C -> |"No"| M{"Enumerate all?"} L -> |"Yes"| N["BFS"] L -> |"No"| O["DFS / Union-Find"] M -> |"Yes"| P["Backtracking"] M -> |"No"| Q["Greedy / DP"] }
```

## Reverse Lookup: Keywords → Pattern

### Array / String

| Problem Keywords | Pattern | Examples |
|---|---|---|
| "**contiguous** subarray" | [Sliding Window](/en/wiki/algorithms/sliding-window/) | 438, 1151, 2134 |
| "subarray of **size k**" | [Sliding Window (fixed)](/en/wiki/algorithms/sliding-window/) | 438 |
| "**longest/shortest** subarray satisfying..." | [Sliding Window (variable)](/en/wiki/algorithms/sliding-window/) | 3, 76, 209 |
| "**sorted** array, find..." | [Two Pointers](/en/wiki/algorithms/two-pointers/) or [Binary Search](/en/wiki/algorithms/binary-search/) | 167, 33, 704 |
| "**two elements that sum to**" | [Two Pointers](/en/wiki/algorithms/two-pointers/) or [HashMap](/en/wiki/algorithms/hashmap-pattern/) | 1, 167 |
| "**anagram**" / "permutation" | [Sliding Window](/en/wiki/algorithms/sliding-window/) + HashMap | 438, 567 |
| "**next greater** element" | [Monotonic Stack](/en/wiki/algorithms/monotonic-stack/) | 496, 739, 84 |
| "**intervals**" / "meetings" / "ranges" | [Merge Intervals](/en/wiki/algorithms/merge-intervals/) | 56, 57, 435 |
| "**frequency**" / "most common" | [HashMap](/en/wiki/algorithms/hashmap-pattern/) | 347, 49 |

### Graph / Tree

| Problem Keywords | Pattern | Examples |
|---|---|---|
| "**number of islands**" / "connected components" | [DFS](/en/wiki/algorithms/dfs/) or [Union-Find](/en/wiki/data-structures/union-find/) | 200, 547 |
| "**shortest distance**" / "minimum steps" | [BFS](/en/wiki/algorithms/bfs/) | 994, 1091, 127 |
| "**prerequisites**" / "ordering" | [Topological Sort](/en/wiki/algorithms/topological-sort/) | 207, 210 |
| "**depth/height** of binary tree" | [DFS](/en/wiki/algorithms/dfs/) + [Binary Tree](/en/wiki/data-structures/binary-tree/) | 104, 226 |
| "**LCA**" / "lowest common ancestor" | [Binary Tree](/en/wiki/data-structures/binary-tree/) | 236 |
| "**same group**" / "connected" | [Union-Find](/en/wiki/data-structures/union-find/) | 547, 684 |
| "**level order**" | [BFS](/en/wiki/algorithms/bfs/) | 102 |

### Optimization / Enumeration

| Problem Keywords | Pattern | Examples |
|---|---|---|
| "**minimum cost**" / "minimum number of" | [DP](/en/wiki/algorithms/dynamic-programming/) or [Greedy](/en/wiki/algorithms/greedy/) | 322, 70, 452 |
| "**number of ways**" / "how many" | [DP](/en/wiki/algorithms/dynamic-programming/) | 70, 62 |
| "**all combinations**" / "all subsets" | [Backtracking](/en/wiki/algorithms/backtracking/) | 78, 46, 39 |
| "**can you reach**" / "is it possible" | [DFS](/en/wiki/algorithms/dfs/) / [DP](/en/wiki/algorithms/dynamic-programming/) | 55 |
| "**kth largest/smallest**" | [Heap](/en/wiki/data-structures/heap/) | 215, 347 |
| "**median** from stream" | [Heap (dual)](/en/wiki/data-structures/heap/) | 295 |
| "**LRU**" / "cache design" | [LRU Cache](/en/wiki/data-structures/lru-cache/) | 146 |
| "**prefix search**" / "autocomplete" | [Trie](/en/wiki/data-structures/trie/) | 208, 211 |

## When In Doubt

| Situation | Decision |
|---|---|
| Greedy seems to work but unsure | Try to find a counterexample. None found → Greedy. Found one → DP |
| DFS or BFS both work | "Shortest" → BFS. Otherwise → DFS (shorter code) |
| Two Pointers vs Sliding Window | Contiguous subsequence → Sliding Window. Otherwise → Two Pointers |
| HashMap alone seems sufficient | Solve with HashMap first, then optimize with other patterns |
| Unsure if complexity is fast enough | Check [complexity table in Math Fundamentals](/en/wiki/math/fundamentals/) |

## Reverse from Input Size

Deduce usable algorithms from constraints ([details in Math Fundamentals](/en/wiki/math/fundamentals/)):

| $n$ range | Usable complexity | Candidate patterns |
|---|---|---|
| $\leq 20$ | $O(2^n)$ | Backtracking, bitmask |
| $\leq 500$ | $O(n^3)$ | DP (triple loop) |
| $\leq 10^4$ | $O(n^2)$ | Naive DP, Two Pointers |
| $\leq 10^6$ | $O(n \log n)$ | Sort + Greedy, Binary Search |
| $\leq 10^8$ | $O(n)$ | Sliding Window, Two Pointers, HashMap |

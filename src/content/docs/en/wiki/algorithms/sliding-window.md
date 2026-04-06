---
title: Sliding Window
description: An efficient technique for searching contiguous subarrays and substrings
sidebar:
  order: 1
---

## Overview

Sliding Window is a technique for efficiently searching **contiguous subsequences** of arrays or strings to find solutions that satisfy given conditions. It often reduces a naive $O(n^2)$ double loop to $O(n)$.

It is one of the most frequently asked patterns in coding interviews.

## Core Idea

1. Define a window with two pointers: `left` and `right`
2. Expand the window by moving `right` to add elements
3. Shrink the window by moving `left` to remove elements when conditions are violated
4. Update the window state (sum, character frequency, etc.) at each step

Since each element enters and leaves the window at most once, the overall complexity is $O(n)$.

```moonmaid
array { [1, 3, 2, 5, 1, 4] highlight(1..3, color=blue, label="window") }
```

> Blue nodes (3, 2, 5) represent the current window. `left = 1`, `right = 3`.

## Two Patterns

### Fixed-size Window

The window size is predetermined. `left` advances at the same pace as `right`.

**Use cases**: "Maximum sum of subarray of length k", "Anagram detection of length k", etc.

**Template:**

```go
// k: window size
for right := 0; right < len(arr); right++ {
    // add arr[right] to window state
    if right >= k {
        // remove arr[right-k] from window state
    }
    if right >= k-1 {
        // window is full — record result
    }
}
```

### Variable-size Window

Finding the longest or shortest window satisfying a condition. `left` only advances when the condition is violated.

**Use cases**: "Longest subarray satisfying condition", "Shortest subarray with sum >= target", etc.

**Template:**

```go
left := 0
for right := 0; right < len(arr); right++ {
    // add arr[right] to window state
    for /* window violates condition */ {
        // remove arr[left] from window state
        left++
    }
    // update result (e.g., max length = right - left + 1)
}
```

## Complexity

$k$ = window size, $n$ = input size

| | Time | Space |
|---|---|---|
| Fixed-size | $O(n)$ | $O(1)$ to $O(k)$ |
| Variable-size | $O(n)$ | $O(1)$ to $O(n)$ |

**Why $O(n)$:** Both `left` and `right` move at most $n$ times each. Even with the inner `for` loop, the total movement of `left` is at most $n$, making it **amortized $O(n)$**.

## Applied Problems

### [438. Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/) — Fixed-size

Find all starting indices of anagrams of string `p` within string `s`.

**Key insight:** Anagram = same character frequency. Window size is fixed at `len(p)`.

```moonmaid
flowchart TD { A["Compute pCount = character frequency of p"] -> B["Compute sCount = frequency of first len(p) chars of s"] B -> C{"sCount == pCount ?"} C -> |"Yes"| D["Add index to result"] C -> |"No"| E["Slide window right by 1"] D -> E E -> F["Add right char, remove left char"] F -> C }
```

```go
func findAnagrams(s string, p string) []int {
    if len(s) < len(p) {
        return nil
    }

    result := []int{}
    var sCount, pCount [26]int
    for i := 0; i < len(p); i++ {
        pCount[p[i]-'a']++
        sCount[s[i]-'a']++
    }
    if sCount == pCount {
        result = append(result, 0)
    }

    for i := len(p); i < len(s); i++ {
        sCount[s[i]-'a']++
        sCount[s[i-len(p)]-'a']--
        if sCount == pCount {
            result = append(result, i-len(p)+1)
        }
    }
    return result
}
```

**Note:** In Go, fixed-size arrays `[26]int` can be compared with `==`. In languages using HashMaps, each comparison costs $O(26)$, but since the alphabet size is constant, the overall complexity remains $O(n)$.

### [1151. Minimum Swaps to Group All 1's Together](https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together/) — Fixed-size

Find the minimum number of swaps to group all 1's together in an array.

**Key insight:** Total number of 1's = window size. Number of 0's in window = number of swaps needed.

```go
func minSwaps(data []int) int {
    ones := 0
    for _, v := range data {
        ones += v
    }
    if ones <= 1 {
        return 0
    }

    // Count zeros in the initial window [0..ones-1]
    zeros := 0
    for i := 0; i < ones; i++ {
        if data[i] == 0 {
            zeros++
        }
    }
    minZeros := zeros

    // Slide the window: add right end, remove left end
    for i := ones; i < len(data); i++ {
        if data[i] == 0 {
            zeros++
        }
        if data[i-ones] == 0 {
            zeros--
        }
        if zeros < minZeros {
            minZeros = zeros
        }
    }
    return minZeros
}
```

### [2134. Minimum Swaps to Group All 1's Together II](https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together-ii/) — Circular Array

An extension of 1151. The array is **circular**.

**Key insight:** Circular arrays can be handled like linear arrays by wrapping indices with `% n`. The loop structure mirrors 1151 — "add right end, remove left end" — with `% n` for circular indexing.

```go
func minSwaps(nums []int) int {
    ones := 0
    for _, v := range nums {
        ones += v
    }
    if ones <= 1 {
        return 0
    }

    n := len(nums)

    // Count zeros in the initial window [0..ones-1]
    zeros := 0
    for i := 0; i < ones; i++ {
        if nums[i] == 0 {
            zeros++
        }
    }
    minZeros := zeros

    // Slide the window with circular indexing
    for i := ones; i < ones+n; i++ {
        if nums[i%n] == 0 {
            zeros++
        }
        if nums[(i-ones)%n] == 0 {
            zeros--
        }
        if zeros < minZeros {
            minZeros = zeros
        }
    }
    return minZeros
}
```

**Difference from 1151:** The loop runs `for i := ones; i < ones+n` with `% n` wrapping. The structure is identical — "add right, remove left".

## How to Recognize

Look for these signals in problem statements:

- **Contiguous** subarray / substring
- **Longest** / **shortest** conditional subsequence
- **Fixed length k** subarray max/min
- **Anagram** / **permutation** detection
- The word **window** itself

If the subsequence does not need to be contiguous (subsequence, not substring), consider DP or Two Pointers instead.

## Common Mistakes

1. **Shrinking with `if` instead of `for`**: `left` may need to move multiple times for a single `right` movement
2. **Off-by-one**: Easy to misjudge when the window becomes "full". For fixed-size, record results at `right >= k-1`
3. **Circular arrays**: Forgetting `% n` causes index out of bounds

## Related

- [Two Pointers](/en/wiki/algorithms/two-pointers/) — A general technique for sorted array searches and linked list cycle detection
- [DFS (Depth-First Search)](/en/wiki/algorithms/dfs/) — A fundamental graph/grid traversal technique

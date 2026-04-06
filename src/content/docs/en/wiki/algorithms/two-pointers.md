---
title: Two Pointers
description: A technique that reduces O(n²) to O(n) for sorted arrays and linked lists
sidebar:
  order: 6
---

## Overview

Two Pointers is a technique that simultaneously manipulates **two indices (pointers)** on an array or linked list to search for solutions. It often reduces a naive $O(n^2)$ double loop to $O(n)$.

While Sliding Window specializes in contiguous subsequences, Two Pointers is more general — applicable to **sorted array searches**, **linked list cycle detection**, and many other scenarios.

## Core Idea

Determine pointer movement direction based on the current state, pruning unnecessary exploration to reduce complexity.

```moonmaid
array { [1, 2, 3, 4, 5, 6, 7] highlight(0, color=blue, label="left") highlight(6, color=red, label="right") }
```

```moonmaid
flowchart TD { A["Place two pointers at initial positions"] -> B{"Termination condition met?"} B -> |"No"| C["Evaluate state from pointer positions"] C -> D{"Decide which pointer to move"} D -> |"Left pointer"| E["Move left"] D -> |"Right pointer"| F["Move right"] D -> |"Both"| G["Move both"] E -> B F -> B G -> B B -> |"Yes"| H["Return result"] }
```

## Patterns

### Opposite Direction (Converging)

Pointers start at **both ends** of a sorted array and converge toward the center. Move the left end right or the right end left depending on the condition.

**Use cases**: Pair search in sorted arrays, area maximization, etc.

**Template:**

```go
func oppositeDirection(arr []int) {
    left, right := 0, len(arr)-1
    for left < right {
        // evaluate condition using arr[left] and arr[right]
        if /* need larger value */ {
            left++
        } else if /* need smaller value */ {
            right--
        } else {
            // found target
            break
        }
    }
}
```

### Same Direction (Fast-Slow)

Two pointers move in the **same direction** at different speeds. The slow pointer advances only when a condition is met; the fast pointer advances every iteration.

**Use cases**: Remove duplicates, move specific elements, linked list cycle detection, etc.

**Template:**

```go
func sameDirection(arr []int) int {
    slow := 0
    for fast := 0; fast < len(arr); fast++ {
        if /* arr[fast] satisfies condition */ {
            arr[slow] = arr[fast]
            slow++
        }
    }
    return slow // new length
}
```

### Partitioning (Dutch National Flag)

Partition an array into **three regions** using three pointers (low, mid, high), placing each element into the appropriate region.

**Use cases**: Three-way sort, pivot-based array partitioning, etc.

**Template:**

```go
func partition(arr []int, pivot int) {
    low, mid, high := 0, 0, len(arr)-1
    for mid <= high {
        switch {
        case arr[mid] < pivot:
            arr[low], arr[mid] = arr[mid], arr[low]
            low++
            mid++
        case arr[mid] > pivot:
            arr[mid], arr[high] = arr[high], arr[mid]
            high--
        default:
            mid++
        }
    }
}
```

## Complexity

| Pattern | Time | Space |
|---|---|---|
| Opposite Direction | $O(n)$ | $O(1)$ |
| Same Direction | $O(n)$ | $O(1)$ |
| Partitioning | $O(n)$ | $O(1)$ |

**Why $O(n)$:** Each pointer traverses the array at most once. In the opposite direction pattern, the combined movement of `left` and `right` is at most $n$. In the same direction pattern, `fast` moves $n$ times and `slow` moves no more than that. In all cases, the **overall complexity is $O(n)$**.

## Applied Problems

### [167. Two Sum II – Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) — Opposite Direction

Find a pair of indices (1-indexed) in a sorted array whose values sum to `target`.

**Key insight:** Since the array is sorted, if the sum is too large, decrement `right`; if too small, increment `left`.

```go
func twoSum(numbers []int, target int) []int {
    left, right := 0, len(numbers)-1
    for left < right {
        sum := numbers[left] + numbers[right]
        switch {
        case sum < target:
            left++
        case sum > target:
            right--
        default:
            return []int{left + 1, right + 1}
        }
    }
    return nil
}
```

### [11. Container With Most Water](https://leetcode.com/problems/container-with-most-water/) — Opposite Direction

Given an array of heights, find the maximum water a container formed by two lines can hold.

**Key insight:** Start with maximum width and move the shorter line inward. Moving the shorter side is the only way to potentially increase the area.

```moonmaid
flowchart TD { A["left = 0, right = n-1"] -> B{"left < right ?"} B -> |"Yes"| C["area = min(height[left], height[right]) * (right - left)"] C -> D["maxArea = max(maxArea, area)"] D -> E{"height[left] < height[right] ?"} E -> |"Yes"| F["left++"] E -> |"No"| G["right--"] F -> B G -> B B -> |"No"| H["return maxArea"] }
```

```go
func maxArea(height []int) int {
    left, right := 0, len(height)-1
    maxWater := 0
    for left < right {
        h := min(height[left], height[right])
        water := h * (right - left)
        if water > maxWater {
            maxWater = water
        }
        if height[left] < height[right] {
            left++
        } else {
            right--
        }
    }
    return maxWater
}
```

### [283. Move Zeroes](https://leetcode.com/problems/move-zeroes/) — Same Direction

Move all zeros to the end of the array while maintaining the relative order of non-zero elements (in-place).

**Key insight:** `slow` points to the next position for a non-zero element. When `fast` finds a non-zero element, swap it to the `slow` position.

```go
func moveZeroes(nums []int) {
    slow := 0
    for fast := 0; fast < len(nums); fast++ {
        if nums[fast] != 0 {
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow++
        }
    }
}
```

## How to Recognize

Look for these signals in problem statements:

- Pair or triplet search in a **sorted** array
- **In-place** element removal or movement
- **Cycle detection** (linked lists)
- Two values whose **sum or difference** meets a specific condition
- Array **partitioning**
- **Palindrome** checking

If the subsequence must be **contiguous**, consider [Sliding Window](/en/wiki/algorithms/sliding-window/) first.

## Common Mistakes

1. **Forgetting the sorted prerequisite**: The opposite direction pattern assumes a sorted array. For unsorted arrays, sort first or use a different approach
2. **Forgetting to update pointers**: Missing a pointer update in an `else` branch causes infinite loops
3. **Boundary conditions**: Confusing `left < right` with `left <= right` can lead to using the same element twice or skipping elements
4. **Swap order in partitioning**: After swapping `mid` and `high`, do not advance `mid` — the newly swapped element still needs inspection

## Related

- [Linked List](/en/wiki/data-structures/linked-list/) — Fast & slow pointers for cycle detection and finding the middle node
- [Sliding Window](/en/wiki/algorithms/sliding-window/) — A Two Pointers variant specialized for contiguous subsequences
- [DFS (Depth-First Search)](/en/wiki/algorithms/dfs/) — A fundamental graph/grid traversal technique
- [BFS (Breadth-First Search)](/en/wiki/algorithms/bfs/) — A fundamental shortest-path traversal technique

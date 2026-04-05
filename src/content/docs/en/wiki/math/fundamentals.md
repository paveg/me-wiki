---
title: Math Fundamentals
description: Essential math for coding interviews — intuitive explanations for non-math backgrounds
sidebar:
  order: 1
---

This page covers the core math concepts that appear frequently in coding interviews. No formal proofs — just intuitive explanations with concrete examples.

## Logarithms

### What does $\log_2 n$ mean?

Simply put: **"How many times can you divide $n$ by 2 before you reach 1?"**

For example, $\log_2 1024 = 10$ means you divide 1024 by 2 exactly 10 times to get 1:

$$1024 \to 512 \to 256 \to 128 \to 64 \to 32 \to 16 \to 8 \to 4 \to 2 \to 1$$

### Why is Binary Search $O(\log n)$?

Binary Search halves the search space at every step. If there are $n$ elements, how many times can you halve until you're left with 1? Exactly $\log_2 n$ times.

### Why are Heap operations $O(\log n)$?

A Heap is a complete binary tree. A tree with $n$ nodes has height $\log_2 n$. Insertions and deletions traverse the tree's height, so they cost $O(\log n)$.

### Common log values

| $n$ | $\log_2 n$ (approx.) |
|---|---|
| $1{,}000$ | $\approx 10$ |
| $1{,}000{,}000$ ($10^6$) | $\approx 20$ |
| $1{,}000{,}000{,}000$ ($10^9$) | $\approx 30$ |

This table is crucial. Even with $10^9$ inputs, an $O(\log n)$ algorithm only needs ~30 operations.

**Related pages**: [Binary Search](/wiki/algorithms/binary-search/), [Heap](/wiki/data-structures/heap/), [Binary Tree](/wiki/data-structures/binary-tree/)

---

## Modular Arithmetic

### Why mod $10^9+7$?

Combinatorial problems can produce astronomically large answers. For instance, $100!$ has 158 digits. Storing such numbers directly causes integer overflow.

$10^9+7$ (= $1{,}000{,}000{,}007$) is a **prime number**. Being prime enables modular inverse (a substitute for division), making it mathematically convenient.

### Key rules

Addition and multiplication can be mod-ed at any intermediate step without changing the result:

$$(a + b) \bmod m = ((a \bmod m) + (b \bmod m)) \bmod m$$

$$(a \times b) \bmod m = ((a \bmod m) \times (b \bmod m)) \bmod m$$

### The subtraction trap

Subtraction can produce negative results:

$$(a - b) \bmod m$$

When $a < b$, the result is negative. The safe pattern is to **add $m$ before taking mod**:

$$(a - b + m) \bmod m$$

### Go code: counting grid paths

```go
const mod = 1_000_000_007

// countPaths counts the number of paths in an m x n grid using DP.
// Each cell's value is the sum of the cell above and to the left, mod 1e9+7.
func countPaths(m, n int) int {
 dp := make([][]int, m)
 for i := range dp {
  dp[i] = make([]int, n)
  dp[i][0] = 1
 }
 for j := 0; j < n; j++ {
  dp[0][j] = 1
 }
 for i := 1; i < m; i++ {
  for j := 1; j < n; j++ {
   dp[i][j] = (dp[i-1][j] + dp[i][j-1]) % mod
  }
 }
 return dp[m-1][n-1]
}
```

### Common mistake

Forgetting to mod intermediate results. Even 64-bit integers overflow when you multiply two numbers close to $10^9$. **Always mod after every multiplication.**

---

## Combinations & Permutations

### Permutation: order matters

The number of ways to arrange $n$ items is $n!$ (n factorial):

$$n! = n \times (n-1) \times (n-2) \times \cdots \times 1$$

Example: arrange 3 people in a line → $3! = 3 \times 2 \times 1 = 6$ ways.

### Combination: order doesn't matter

The number of ways to choose $k$ items from $n$ is $\binom{n}{k}$:

$$\binom{n}{k} = \frac{n!}{k!(n-k)!}$$

Example: choose 3 people from 5 → $\binom{5}{3} = \frac{5!}{3! \times 2!} = \frac{120}{6 \times 2} = 10$ ways.

### Connection to Backtracking

- Enumerating all subsets → $2^n$ subsets (each element is either included or not)
- Enumerating all permutations → $n!$ permutations

When $n$ is large, these grow explosively, which is why pruning is essential.

### Pascal's Triangle

$$\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$$

This recurrence is extremely useful for computing combinations via DP. Instead of calculating $n!$ directly (which overflows easily), Pascal's Triangle uses only addition.

**Related pages**: [Backtracking](/wiki/algorithms/backtracking/), [Dynamic Programming](/wiki/algorithms/dynamic-programming/)

---

## Bit Operations

### Basic operations

| Operation | Symbol | Example | Result |
|---|---|---|---|
| AND | `&` | `0b1100 & 0b1010` | `0b1000` (8) |
| OR | `\|` | `0b1100 \| 0b1010` | `0b1110` (14) |
| XOR | `^` | `0b1100 ^ 0b1010` | `0b0110` (6) |
| NOT | `^` (Go) | `^0b1100` (uint) | bitwise inversion |
| Left shift | `<<` | `1 << 3` | `8` ($2^3$) |
| Right shift | `>>` | `8 >> 2` | `2` ($8 \div 4$) |

### XOR tricks

XOR has two useful properties:

- $a \oplus a = 0$ (XOR of identical values is 0)
- $a \oplus 0 = a$ (XOR with 0 gives the original value)

This lets you find "the single number" in an array in $O(n)$ time and $O(1)$ space.

### Power of 2 check

To check if $n$ is a power of 2:

```go
n > 0 && n&(n-1) == 0
```

Powers of 2 have exactly one `1` bit (e.g., $8 = 1000_2$). Subtracting 1 flips all lower bits ($7 = 0111_2$), so AND gives 0.

### Counting set bits (Brian Kernighan's algorithm)

```go
// countBits returns the number of set bits (1s) in n.
func countBits(n int) int {
 count := 0
 for n > 0 {
  n &= n - 1 // clear the lowest set bit
  count++
 }
 return count
}
```

`n & (n-1)` clears the lowest set bit. The number of iterations equals the number of set bits.

### LeetCode 136. Single Number

Find the element that appears exactly once in an array where every other element appears twice.

```go
// singleNumber finds the element that appears exactly once.
// Every other element appears exactly twice.
// XOR of all elements cancels out duplicates: a ^ a = 0.
func singleNumber(nums []int) int {
 result := 0
 for _, n := range nums {
  result ^= n
 }
 return result
}
```

[LeetCode 136. Single Number](https://leetcode.com/problems/single-number/)

---

## Complexity Intuition

The single most practical interview heuristic: **work backwards from the input size to determine what complexity you can afford.**

In competitive programming with typical time limits (1-2 seconds), roughly $10^8$ operations is the upper bound.

| $n$ range | Max complexity | Examples |
|---|---|---|
| $\leq 10$ | $O(n!)$ | permutations |
| $\leq 20$ | $O(2^n)$ | subsets |
| $\leq 500$ | $O(n^3)$ | Floyd-Warshall |
| $\leq 5{,}000$ | $O(n^2)$ | naive DP |
| $\leq 10^6$ | $O(n \log n)$ | sorting |
| $\leq 10^8$ | $O(n)$ | linear scan |
| $> 10^8$ | $O(\log n)$ or $O(1)$ | binary search, math |

### The most important heuristic

> If the input is $10^5$, you need an $O(n \log n)$ algorithm or better.

Memorize this one line. During an interview, check the constraint on $n$ and match it against the table above to quickly narrow down which algorithms are viable.

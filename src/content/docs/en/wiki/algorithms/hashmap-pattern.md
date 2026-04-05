---
title: HashMap Pattern
description: Efficient lookup, frequency counting, and grouping techniques using hash maps
sidebar:
  order: 12
---

## Overview

The HashMap pattern leverages the $O(1)$ average-time lookup and update of key-value pairs to efficiently perform frequency counting, existence checks, and grouping operations.

While hash maps are used as auxiliary structures in nearly every algorithm topic, there are many problems where the HashMap itself is the core of the solution. In coding interviews, this pattern is as common as Two Pointers and Sliding Window.

## Core Idea

1. Scan an array or string once, accumulating information in a HashMap
2. Reference accumulated information in $O(1)$ to evaluate conditions
3. This often reduces a naive $O(n^2)$ double loop to $O(n)$

```moonmaid
flowchart TD { A["Scan array left to right"] -> B["Look up current element info in HashMap"] B -> C{"Condition met?"} C -> |"Yes"| D["Record result"] C -> |"No"| E["Update HashMap"] D -> E E -> F{"More elements?"} F -> |"Yes"| A F -> |"No"| G["Return result"] }
```

## Patterns

### Frequency Count

Count the number of occurrences of each element. The most fundamental and most common pattern.

**When to use**: Anagram detection, most frequent element, subarrays with at most k distinct elements, etc.

**Template:**

```go
func frequencyCount(arr []int) map[int]int {
    freq := make(map[int]int)
    for _, v := range arr {
        freq[v]++
    }
    return freq
}
```

:::caution
In Go, accessing a non-existent map key returns the zero value, so `freq[v]++` works safely without an existence check. Other languages may require explicit initialization.
:::

### Complement Lookup

Find a "complement" that, combined with the current element, satisfies a condition — looked up in $O(1)$ from the HashMap.

**When to use**: Two Sum, pair finding, pairs with exact difference k, etc.

**Template:**

```go
func complementLookup(arr []int, target int) (int, int) {
    seen := make(map[int]int) // value -> index
    for i, v := range arr {
        complement := target - v
        if j, ok := seen[complement]; ok {
            return j, i
        }
        seen[v] = i
    }
    return -1, -1
}
```

### Grouping

Group elements by a computed key. The key generation logic is often the crux of the problem.

**When to use**: Anagram grouping, pattern classification, etc.

**Template:**

```go
func groupByKey(items []string, keyFn func(string) string) map[string][]string {
    groups := make(map[string][]string)
    for _, item := range items {
        key := keyFn(item)
        groups[key] = append(groups[key], item)
    }
    return groups
}
```

### Sliding Window + HashMap

Combined with [Sliding Window](/en/wiki/algorithms/sliding-window/), track element frequencies within the window. Update the HashMap incrementally as the window expands and contracts.

**When to use**: "Longest substring with at most k distinct characters", "anagram detection", etc.

**Template:**

```go
func slidingWindowWithMap(s string, k int) int {
    freq := make(map[byte]int)
    left, maxLen := 0, 0
    for right := 0; right < len(s); right++ {
        freq[s[right]]++
        for len(freq) > k {
            freq[s[left]]--
            if freq[s[left]] == 0 {
                delete(freq, s[left])
            }
            left++
        }
        if right-left+1 > maxLen {
            maxLen = right - left + 1
        }
    }
    return maxLen
}
```

## Complexity

| Pattern | Time | Space |
|---|---|---|
| Frequency Count | $O(n)$ | $O(k)$ ($k$ = unique elements) |
| Complement Lookup | $O(n)$ | $O(n)$ |
| Grouping | $O(n \cdot m)$ ($m$ = key generation cost) | $O(n)$ |
| Sliding Window + HashMap | $O(n)$ | $O(k)$ |

**Why $O(n)$:** The array is scanned once, and each HashMap operation is $O(1)$ on average. Total: $O(n)$.

## Applied Problems

### [1. Two Sum](https://leetcode.com/problems/two-sum/) — Complement Lookup

Find indices of two numbers in an array that add up to `target`.

**Key Insight:** For each element, check whether `target - nums[i]` exists among previously seen elements using the HashMap in $O(1)$.

```go
func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, v := range nums {
        if j, ok := seen[target-v]; ok {
            return []int{j, i}
        }
        seen[v] = i
    }
    return nil
}
```

**Note:** If the array is sorted, [Two Pointers](/en/wiki/algorithms/two-pointers/) solves this in $O(1)$ space. For unsorted arrays, HashMap is optimal.

### [49. Group Anagrams](https://leetcode.com/problems/group-anagrams/) — Grouping

Group an array of strings by their anagram equivalence classes.

**Key Insight:** Anagrams share the same character frequency. Sorting each string produces a canonical key for grouping.

```moonmaid
flowchart TD { A["Input: eat, tea, tan, ate, nat, bat"] -> B["Sort each string"] B -> C["aet: eat, tea, ate"] B -> D["ant: tan, nat"] B -> E["abt: bat"] C -> F["Return grouped results"] D -> F E -> F }
```

```go
func groupAnagrams(strs []string) [][]string {
    groups := make(map[string][]string)
    for _, s := range strs {
        key := sortString(s)
        groups[key] = append(groups[key], s)
    }
    result := make([][]string, 0, len(groups))
    for _, group := range groups {
        result = append(result, group)
    }
    return result
}

func sortString(s string) string {
    b := []byte(s)
    sort.Slice(b, func(i, j int) bool { return b[i] < b[j] })
    return string(b)
}
```

**Alternative:** Use a `[26]int` frequency array as the key instead of sorting. This runs in $O(n \cdot m)$ vs. sorting's $O(n \cdot m \log m)$.

```go
func groupAnagrams(strs []string) [][]string {
    groups := make(map[[26]int][]string)
    for _, s := range strs {
        var key [26]int
        for i := 0; i < len(s); i++ {
            key[s[i]-'a']++
        }
        groups[key] = append(groups[key], s)
    }
    result := make([][]string, 0, len(groups))
    for _, group := range groups {
        result = append(result, group)
    }
    return result
}
```

### [560. Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) — Prefix Sum + HashMap

Count the number of contiguous subarrays whose sum equals exactly `k`.

**Key Insight:** Using prefix sums, a subarray sum equals `prefixSum[j] - prefixSum[i]`. Track "how many times `prefixSum[j] - k` has appeared before" in a HashMap.

```moonmaid
flowchart TD { A["prefix = 0, count = 0"] -> B["HashMap: 0: 1"] B -> C["Scan array"] C -> D["prefix += nums[i]"] D -> E{"prefix - k in HashMap?"} E -> |"Yes"| F["count += HashMap[prefix - k]"] E -> |"No"| G["HashMap[prefix]++"] F -> G G -> C }
```

```go
func subarraySum(nums []int, k int) int {
    count := 0
    prefix := 0
    seen := map[int]int{0: 1}
    for _, v := range nums {
        prefix += v
        if c, ok := seen[prefix-k]; ok {
            count += c
        }
        seen[prefix]++
    }
    return count
}
```

**Note:** Forgetting the initial `{0: 1}` in `seen` causes subarrays starting from index 0 to be missed.

## How to Recognize

Look for these signals in problem statements:

- **Frequency** / **count occurrences**
- **Duplicate** detection or removal
- **Sum or difference** of two elements equals a target (unsorted array)
- **Anagram** / **permutation** grouping
- **Subarray sum** equals a target
- **First/last occurrence** of an element
- **Distinct** element count

## Common Mistakes

1. **Zero value handling**: In Go, `map[key]` returns 0 for non-existent keys. Use `v, ok := map[key]` when existence checking matters
2. **Prefix Sum initialization**: Forgetting `{0: 1}` causes subarrays starting from the beginning to be missed
3. **Key design**: In Group Anagrams, `[]byte` cannot be used directly as a map key in Go — convert to `string` or use `[26]int`
4. **Deletion in Sliding Window**: When combining with Sliding Window, failing to `delete` keys with frequency 0 causes `len(map)` to be incorrect
5. **Order dependence**: HashMaps do not preserve insertion order. If order matters, maintain a separate slice

## Related

- [Sliding Window](/en/wiki/algorithms/sliding-window/) — Contiguous subsequence search. Often combined with HashMap to track window frequencies
- [Two Pointers](/en/wiki/algorithms/two-pointers/) — Pair search on sorted arrays. For unsorted arrays, HashMap is the right choice
- [Binary Search](/en/wiki/algorithms/binary-search/) — Search on sorted data. HashMap provides $O(1)$ lookup on unsorted data

---
title: Trie
description: Trie (prefix tree) for efficient prefix-based string search
sidebar:
  order: 6
---

## Overview

A Trie (prefix tree) is a tree structure for efficiently storing and searching a set of strings. Each node represents a single character, and a path from root to leaf corresponds to one word.

**Common use cases:**

- **Autocomplete**: Quickly retrieve candidates matching a typed prefix
- **Spell checking**: Determine whether a word exists in a dictionary
- **IP routing**: Longest prefix matching
- **String search problems**: Scenarios involving frequent prefix-based queries

**Complexity**: Given word length $m$, insert, search, and prefix search all run in $O(m)$. While this matches HashMap lookup time, a Trie **shares common prefixes**, making it more memory-efficient and naturally supporting prefix-based operations like forward matching.

## Core Idea

A Trie is a tree where each node maps characters to child nodes. The root is empty, and each edge corresponds to one character.

```moonmaid
flowchart TD { ROOT["(root)"] -> A["a"] ROOT -> T["t"] A -> AP["p"] AP -> APP["p"] APP -> APPL["l"] APPL -> APPLE["e (end)"] AP -> APT["t (end)"] T -> TO["o (end)"] TO -> TOP["p (end)"] }
```

The diagram above stores `"apple"`, `"apt"`, `"to"`, and `"top"`. The `✓` marks the `isEnd` flag indicating a complete word.

**Key observations:**

- `"apple"` and `"apt"` share the prefix `"ap"`
- Searching with prefix `"ap"` efficiently enumerates all words under that subtree
- Each node has at most 26 children (lowercase English letters only)

## Template

Standard Trie implementation for lowercase English letters:

```go
type TrieNode struct {
    children [26]*TrieNode
    isEnd    bool
}

type Trie struct {
    root *TrieNode
}

func NewTrie() *Trie {
    return &Trie{root: &TrieNode{}}
}

func (t *Trie) Insert(word string) {
    node := t.root
    for _, ch := range word {
        idx := ch - 'a'
        if node.children[idx] == nil {
            node.children[idx] = &TrieNode{}
        }
        node = node.children[idx]
    }
    node.isEnd = true
}

func (t *Trie) Search(word string) bool {
    node := t.find(word)
    return node != nil && node.isEnd
}

func (t *Trie) StartsWith(prefix string) bool {
    return t.find(prefix) != nil
}

// find traverses the trie following the given key and returns the terminal node
func (t *Trie) find(key string) *TrieNode {
    node := t.root
    for _, ch := range key {
        idx := ch - 'a'
        if node.children[idx] == nil {
            return nil
        }
        node = node.children[idx]
    }
    return node
}
```

## Complexity

| Operation | Time | Space |
|---|---|---|
| Insert | $O(m)$ | $O(m)$ (worst case, creating entire new path) |
| Search | $O(m)$ | $O(1)$ |
| StartsWith | $O(m)$ | $O(1)$ |
| Overall space | — | $O(N \cdot m)$ ($N$ = number of words) |

$m$ is the length of the target word or prefix. Unlike hash tables, Tries share common prefixes, so actual memory usage is often much smaller than the worst case.

## Applied Problems

### [208. Implement Trie](https://leetcode.com/problems/implement-trie-prefix-tree/)

Implement a Trie with `insert`, `search`, and `startsWith`. The template above is essentially the solution.

```go
type Trie struct {
    children [26]*Trie
    isEnd    bool
}

func Constructor() Trie {
    return Trie{}
}

func (t *Trie) Insert(word string) {
    node := t
    for _, ch := range word {
        idx := ch - 'a'
        if node.children[idx] == nil {
            node.children[idx] = &Trie{}
        }
        node = node.children[idx]
    }
    node.isEnd = true
}

func (t *Trie) Search(word string) bool {
    node := t.find(word)
    return node != nil && node.isEnd
}

func (t *Trie) StartsWith(prefix string) bool {
    return t.find(prefix) != nil
}

func (t *Trie) find(key string) *Trie {
    node := t
    for _, ch := range key {
        idx := ch - 'a'
        if node.children[idx] == nil {
            return nil
        }
        node = node.children[idx]
    }
    return node
}
```

### [211. Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/)

Support search where `.` acts as a wildcard matching any single character. On encountering `.`, recursively explore all children.

```go
type WordDictionary struct {
    children [26]*WordDictionary
    isEnd    bool
}

func Constructor() WordDictionary {
    return WordDictionary{}
}

func (wd *WordDictionary) AddWord(word string) {
    node := wd
    for _, ch := range word {
        idx := ch - 'a'
        if node.children[idx] == nil {
            node.children[idx] = &WordDictionary{}
        }
        node = node.children[idx]
    }
    node.isEnd = true
}

func (wd *WordDictionary) Search(word string) bool {
    return wd.dfs(word, 0)
}

func (wd *WordDictionary) dfs(word string, i int) bool {
    if i == len(word) {
        return wd.isEnd
    }
    ch := word[i]
    if ch == '.' {
        // wildcard: try all children
        for _, child := range wd.children {
            if child != nil && child.dfs(word, i+1) {
                return true
            }
        }
        return false
    }
    idx := ch - 'a'
    if wd.children[idx] == nil {
        return false
    }
    return wd.children[idx].dfs(word, i+1)
}
```

**Note:** [212. Word Search II](https://leetcode.com/problems/word-search-ii/) is an advanced problem combining Trie + backtracking. It pairs board DFS with a Trie to search for multiple words simultaneously.

## How to Recognize

- "Search by prefix" or "forward matching"
- "Implement autocomplete"
- "Check whether a word exists in a dictionary"
- Operations on multiple strings leveraging shared prefixes
- Wildcard search (`.` or `*`)

## Common Mistakes

1. **Forgetting the `isEnd` flag**: Without setting `isEnd = true` at the end of Insert, Search will not work correctly
2. **Confusing Search and StartsWith**: Search requires an exact match (`isEnd == true`), while StartsWith only checks prefix existence (node exists)
3. **Fixed array size**: Using `[26]` assumes lowercase English only. Check the problem's character set — use `map[rune]*TrieNode` if uppercase or other characters are involved
4. **Not short-circuiting wildcard search**: When matching `.`, return `true` as soon as one child returns `true`. Continuing to explore all children causes TLE

## Related

- [Binary Tree / BST](/en/wiki/data-structures/binary-tree/) — Tree structure fundamentals
- [Backtracking](/en/wiki/algorithms/backtracking/) — Frequently combined with Trie + DFS
- [DFS (Depth-First Search)](/en/wiki/algorithms/dfs/) — Depth-first traversal for trees and graphs

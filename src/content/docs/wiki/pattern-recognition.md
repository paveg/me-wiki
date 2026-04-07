---
title: パターン逆引き
description: 問題文のキーワードから使うべきアルゴリズムを特定する
sidebar:
  order: 1
---

## 問題文 → パターンの判定フロー

```moonmaid
flowchart TD { A{"配列/文字列の問題?"} -> |"Yes"| B{"連続部分列?"} A -> |"No"| C{"グラフ/木の問題?"} B -> |"Yes"| D{"ウィンドウサイズ固定?"} B -> |"No"| E{"ソート済み?"} D -> |"Yes"| F["Sliding Window (固定幅)"] D -> |"No"| G["Sliding Window (可変幅)"] E -> |"Yes"| H["Two Pointers / Binary Search"] E -> |"No"| I{"最適値を求める?"} I -> |"Yes"| J["Dynamic Programming"] I -> |"No"| K["HashMap / Greedy"] C -> |"Yes"| L{"最短距離?"} C -> |"No"| M{"全列挙?"} L -> |"Yes"| N["BFS"] L -> |"No"| O["DFS / Union-Find"] M -> |"Yes"| P["Backtracking"] M -> |"No"| Q["Greedy / DP"] }
```

## 逆引き表: キーワード → パターン

### 配列・文字列系

| 問題文のキーワード | パターン | 例題 |
|---|---|---|
| 「**連続する**部分配列」「contiguous subarray」 | [Sliding Window](/wiki/algorithms/sliding-window/) | 438, 1151, 2134 |
| 「**長さ k** の部分列」「window of size k」 | [Sliding Window (固定幅)](/wiki/algorithms/sliding-window/) | 438 |
| 「**最長/最短**の条件付き部分列」 | [Sliding Window (可変幅)](/wiki/algorithms/sliding-window/) | 3, 76, 209 |
| 「**ソート済み**配列で〜を探せ」 | [Two Pointers](/wiki/algorithms/two-pointers/) or [Binary Search](/wiki/algorithms/binary-search/) | 167, 33, 704 |
| 「**2つの要素の和**」「pair that sums to」 | [Two Pointers](/wiki/algorithms/two-pointers/) or [HashMap](/wiki/algorithms/hashmap-pattern/) | 1, 167 |
| 「**アナグラム**」「permutation」 | [Sliding Window](/wiki/algorithms/sliding-window/) + HashMap | 438, 567 |
| 「**次に大きい要素**」「next greater」 | [Monotonic Stack](/wiki/algorithms/monotonic-stack/) | 496, 739, 84 |
| 「**区間**」「intervals」「meetings」 | [Merge Intervals](/wiki/algorithms/merge-intervals/) | 56, 57, 435 |
| 「**頻度**」「frequency」「most common」 | [HashMap](/wiki/algorithms/hashmap-pattern/) | 347, 49 |

### グラフ・木系

| 問題文のキーワード | パターン | 例題 |
|---|---|---|
| 「**島の数**」「connected components」 | [DFS](/wiki/algorithms/dfs/) or [Union-Find](/wiki/data-structures/union-find/) | 200, 547 |
| 「**最短距離**」「minimum steps」 | [BFS](/wiki/algorithms/bfs/) | 994, 1091, 127 |
| 「**前提条件の順序**」「prerequisites」 | [Topological Sort](/wiki/algorithms/topological-sort/) | 207, 210 |
| 「**二分木の深さ/高さ**」 | [DFS](/wiki/algorithms/dfs/) + [Binary Tree](/wiki/data-structures/binary-tree/) | 104, 226 |
| 「**LCA**」「lowest common ancestor」 | [Binary Tree](/wiki/data-structures/binary-tree/) | 236 |
| 「**同じグループか**」「connected」 | [Union-Find](/wiki/data-structures/union-find/) | 547, 684 |
| 「**レベル順**」「level order」 | [BFS](/wiki/algorithms/bfs/) | 102 |

### 最適化・列挙系

| 問題文のキーワード | パターン | 例題 |
|---|---|---|
| 「**最小コスト**」「minimum number of」 | [DP](/wiki/algorithms/dynamic-programming/) or [Greedy](/wiki/algorithms/greedy/) | 322, 70, 452 |
| 「**何通り**」「number of ways」 | [DP](/wiki/algorithms/dynamic-programming/) | 70, 62 |
| 「**全ての組み合わせ**」「all subsets」 | [Backtracking](/wiki/algorithms/backtracking/) | 78, 46, 39 |
| 「**〜できるか**」「can you reach」 | [DFS](/wiki/algorithms/dfs/) / [DP](/wiki/algorithms/dynamic-programming/) | 55 |
| 「**k 番目に大きい/小さい**」 | [Heap](/wiki/data-structures/heap/) | 215, 347 |
| 「**中央値**」「median from stream」 | [Heap (双ヒープ)](/wiki/data-structures/heap/) | 295 |
| 「**LRU**」「cache design」 | [LRU Cache](/wiki/data-structures/lru-cache/) | 146 |
| 「**プレフィックス検索**」「autocomplete」 | [Trie](/wiki/data-structures/trie/) | 208, 211 |

## 迷ったときの判断基準

| 状況 | 判断 |
|---|---|
| Greedy で解けそうだが確信がない | 反例を考える。見つからなければ Greedy、見つかれば DP |
| DFS と BFS どちらでもいける | 「最短」が問われたら BFS、それ以外は DFS（コードが短い） |
| Two Pointers と Sliding Window の違い | 連続部分列なら Sliding Window、そうでなければ Two Pointers |
| HashMap だけで解ける気がする | まず HashMap で解いてから、最適化として他のパターンを検討 |
| 計算量が間に合うか不安 | [数学基礎の計算量テーブル](/wiki/math/fundamentals/)を参照 |

## 入力サイズからの逆算

制約から使えるアルゴリズムを逆算する（[詳細は数学基礎へ](/wiki/math/fundamentals/)）:

| $n$ の範囲 | 使える計算量 | 候補パターン |
|---|---|---|
| $\leq 20$ | $O(2^n)$ | Backtracking, ビットマスク |
| $\leq 500$ | $O(n^3)$ | DP (3重ループ) |
| $\leq 10^4$ | $O(n^2)$ | ナイーブな DP, Two Pointers |
| $\leq 10^6$ | $O(n \log n)$ | ソート + Greedy, Binary Search |
| $\leq 10^8$ | $O(n)$ | Sliding Window, Two Pointers, HashMap |

---
title: Binary Search
description: ソート済み配列や単調性のある探索空間に対する O(log n) の探索手法
sidebar:
  order: 5
---

## 概要

Binary Search（二分探索）は、**ソート済み配列**や**単調性のある探索空間**に対して、探索範囲を毎回半分に絞り込むことで $O(\log n)$ で解を見つける手法。

線形探索 $O(n)$ に比べて圧倒的に高速であり、コーディング面接では基本中の基本でありながら、応用パターンが多岐にわたる重要なアルゴリズム。

## 核となるアイデア

1. 探索範囲 `[left, right]` を定義する
2. 中央値 `mid` を計算する
3. `mid` の値に基づいて、探索範囲を左半分または右半分に絞り込む
4. 範囲が空になるか、答えが見つかるまで繰り返す

各ステップで探索範囲が半分になるため、全体で $O(\log n)$ になる。

```moonmaid
array { [1, 3, 5, 7, 9, 11, 13] highlight(3, color=red, label="mid") highlight(0, color=blue, label="left") highlight(6, color=blue, label="right") }
```

```moonmaid
flowchart TD { A["left = 0, right = n - 1"] -> B["mid = left + (right - left) / 2"] B -> C{"target == arr[mid] ?"} C -> |"Yes"| D["return mid"] C -> |"No"| E{"target < arr[mid] ?"} E -> |"Yes"| F["right = mid - 1"] E -> |"No"| G["left = mid + 1"] F -> H{"left <= right ?"} G -> H H -> |"Yes"| B H -> |"No"| I["return -1 (not found)"] }
```

## テンプレート

標準的な二分探索のテンプレート。ソート済み配列から `target` を探す。

```go
func binarySearch(nums []int, target int) int {
    left, right := 0, len(nums)-1
    for left <= right {
        mid := left + (right-left)/2 // prevent overflow
        if nums[mid] == target {
            return mid
        } else if nums[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return -1
}
```

## パターン

### ソート済み配列での探索

最も基本的なパターン。配列がソートされていれば、`target` の位置を $O(\log n)$ で特定できる。

**使い所**: 「ソート済み配列で値を検索」「挿入位置を求める」など。

### 答えに対する二分探索（Binary Search on Answer）

答えの候補となる値の範囲 `[lo, hi]` に対して二分探索を行う。「条件を満たす最小値（または最大値）」を求めるパターン。

**使い所**: 「最大値を最小化」「X を達成できるか？」「条件を満たす最小の k」など。

**テンプレート:**

```go
func binarySearchOnAnswer(lo, hi int, canAchieve func(int) bool) int {
    for lo < hi {
        mid := lo + (hi-lo)/2
        if canAchieve(mid) {
            hi = mid // mid is a valid answer, try smaller
        } else {
            lo = mid + 1 // mid is too small
        }
    }
    return lo
}
```

**キーポイント:** 判定関数 `canAchieve` が単調であること（ある閾値以上で常に `true`、未満で常に `false`）。

### 回転ソート済み配列での探索

ソート済み配列が回転している場合。`mid` で分割したとき、少なくとも片方は必ずソートされている性質を利用する。

**使い所**: LeetCode 33 のように、回転した配列から値を探す場合。

## 計算量

| | 時間 | 空間 |
|---|---|---|
| 標準二分探索 | $O(\log n)$ | $O(1)$ |
| 答えに対する二分探索 | $O(\log n \times f(n))$ | $O(1)$ |

**なぜ $O(\log n)$ か:** 探索範囲が毎回半分になるため、$n$ 個の要素に対して最大 $\log_2 n$ 回の比較で済む。答えに対する二分探索では、各ステップで判定関数 $f(n)$ のコストが加わる。

## 実問題での適用

### [704. Binary Search](https://leetcode.com/problems/binary-search/) — 基本

ソート済み配列から `target` を探し、インデックスを返す。存在しなければ `-1`。

**着眼点:** テンプレートそのまま。オーバーフロー防止の `mid` 計算に注意。

```go
func search(nums []int, target int) int {
    left, right := 0, len(nums)-1
    for left <= right {
        mid := left + (right-left)/2
        if nums[mid] == target {
            return mid
        } else if nums[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return -1
}
```

### [33. Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)

回転ソート済み配列（例: `[4,5,6,7,0,1,2]`）から `target` を探す。

**着眼点:** `mid` で分割すると、左半分 `[left, mid]` か右半分 `[mid, right]` のどちらかは必ずソートされている。ソートされた側に `target` が含まれるかで範囲を絞る。

```go
func search(nums []int, target int) int {
    left, right := 0, len(nums)-1
    for left <= right {
        mid := left + (right-left)/2
        if nums[mid] == target {
            return mid
        }
        if nums[left] <= nums[mid] {
            // left half is sorted
            if nums[left] <= target && target < nums[mid] {
                right = mid - 1
            } else {
                left = mid + 1
            }
        } else {
            // right half is sorted
            if nums[mid] < target && target <= nums[right] {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
    }
    return -1
}
```

### [875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) — 答えに対する二分探索

Koko は `h` 時間以内に全てのバナナを食べたい。1時間あたりの食べる速度 `k` の最小値を求める。

**着眼点:** 速度 `k` を答えの候補として二分探索する。`k` が十分大きければ時間内に食べられる（単調性がある）。判定関数で「速度 `k` で `h` 時間以内に食べ切れるか」を検証。

```go
func minEatingSpeed(piles []int, h int) int {
    lo, hi := 1, 0
    for _, p := range piles {
        if p > hi {
            hi = p
        }
    }

    for lo < hi {
        mid := lo + (hi-lo)/2
        if canFinish(piles, mid, h) {
            hi = mid
        } else {
            lo = mid + 1
        }
    }
    return lo
}

func canFinish(piles []int, speed, h int) bool {
    hours := 0
    for _, p := range piles {
        hours += (p + speed - 1) / speed // ceiling division
    }
    return hours <= h
}
```

## 見極めるためのシグナル

以下のキーワードが問題文に含まれていたら Binary Search を疑う:

- **ソート済み** (sorted) 配列に対する検索
- **最小化** / **最大化** + 条件判定（答えに対する二分探索）
- 「**X を達成できるか？**」という Yes/No 判定を繰り返す構造
- **回転ソート済み** (rotated sorted) 配列
- $O(\log n)$ が求められる場合

## よくある間違い

1. **`mid` のオーバーフロー**: `(left + right) / 2` は `left + right` がオーバーフローする可能性がある。`left + (right - left) / 2` を使う
2. **無限ループ**: `lo < hi` のループで `lo = mid`（`+1` なし）にすると、`lo == mid` のとき進まなくなる。切り上げ除算 `lo + (hi - lo + 1) / 2` を使うか、`lo = mid + 1` にする
3. **境界の更新ミス**: `left <= right` と `left < right` の使い分けを間違えると、要素を見逃すか無限ループになる
4. **回転配列での等号処理**: `nums[left] <= nums[mid]` の `<=` を `<` にすると、`left == mid` のケースで誤判定する

## 関連

- [Sliding Window](/wiki/algorithms/sliding-window/) — 連続部分列に対する効率的な探索手法
- [DFS (Depth-First Search)](/wiki/algorithms/dfs/) — グラフ・グリッド探索の基本手法
- [BFS (Breadth-First Search)](/wiki/algorithms/bfs/) — 最短経路探索の基本手法
- [Greedy](/wiki/algorithms/greedy/) — 局所最適を積み重ねる貪欲法

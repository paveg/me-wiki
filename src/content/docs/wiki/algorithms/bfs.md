---
title: BFS (Breadth-First Search)
description: 最短経路やレベル順走査に強いグラフ探索手法
sidebar:
  order: 3
---

## 概要

BFS（幅優先探索）は、グラフやグリッドを**開始ノードから近い順に探索**する手法。キューを使って実装する。

重みなしグラフにおける**最短経路**を保証する唯一の基本探索アルゴリズムであり、「最小ステップ数」「最短距離」が問われたら真っ先に検討すべきパターン。

## 核となるアイデア

1. 開始ノードをキューに入れ、訪問済みにする
2. キューの先頭を取り出す
3. 隣接ノードのうち未訪問のものをキューに追加し、訪問済みにする
4. キューが空になるまで繰り返す

```moonmaid
flowchart TD { A["開始ノードをキューに入れる"] -> B["キューから先頭を取り出す"] B -> C{"未訪問の隣接ノードがある？"} C -> |"Yes"| D["キューに追加 + 訪問済みにする"] D -> C C -> |"No"| E{"キューが空？"} E -> |"No"| B E -> |"Yes"| F["探索完了"] }
```

## テンプレート（グリッド）

```go
func bfsGrid(grid [][]int, startI, startJ int, wall int) int {
    rows, cols := len(grid), len(grid[0])
    type point struct{ i, j int }
    dirs := [][2]int{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}

    queue := []point{{startI, startJ}}
    visited := map[point]bool{{startI, startJ}: true}
    steps := 0

    for len(queue) > 0 {
        size := len(queue) // current level size
        for k := 0; k < size; k++ {
            p := queue[0]
            queue = queue[1:]
            // process p (e.g., check if goal reached)
            for _, d := range dirs {
                np := point{p.i + d[0], p.j + d[1]}
                if np.i >= 0 && np.i < rows && np.j >= 0 && np.j < cols &&
                    !visited[np] && grid[np.i][np.j] != wall {
                    visited[np] = true
                    queue = append(queue, np)
                }
            }
        }
        steps++ // one level completed
    }
    return steps
}
```

**ポイント:** `size := len(queue)` でレベル単位の処理ができる。最短距離を求める場合、レベル = ステップ数となる。

## なぜ最短経路を保証するか

BFS はレベル（距離）順に探索する。距離 $d$ のノードを全て処理してから距離 $d+1$ のノードに進む。したがって、あるノードに初めて到達した時点でのステップ数が最短距離になる。

ただし**辺に重みがある場合は保証しない**。その場合は Dijkstra 法が必要。

## DFS vs BFS（再掲）

| | [DFS](/wiki/algorithms/dfs/) | BFS |
|---|---|---|
| データ構造 | スタック（or 再帰） | キュー |
| 探索順 | 深く掘ってから戻る | 近い順に広がる |
| 最短経路 | 保証しない | **保証する**（重みなしグラフ） |
| メモリ | $O(h)$（深さ） | $O(w)$（幅＝最大の層のノード数） |

## 計算量

グリッド（$m \times n$）の場合:

| 時間 | 空間 |
|---|---|
| $O(m \times n)$ | $O(\min(m, n))$ |

各セルを最大1回訪問するため時間は $O(m \times n)$。キューの最大サイズはグリッドの対角線上に広がる波面で、$O(\min(m, n))$ に比例する。

## 典型的な問題パターン

### 最短ステップ数

迷路の入口から出口までの最短ステップ数を求める等、BFS の最も基本的な応用。

- [994. Rotting Oranges](https://leetcode.com/problems/rotting-oranges/) — Multi-source BFS + 最短ステップ数の組み合わせ
- [1091. Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/) — 8方向 BFS
- [127. Word Ladder](https://leetcode.com/problems/word-ladder/) — グラフ上の最短変換

### Multi-source BFS

> グリッド上の全ての `0` から最も近い `1` までの距離をそれぞれ求めよ（[542. 01 Matrix](https://leetcode.com/problems/01-matrix/)）

全ての始点を最初にキューに入れてから BFS を開始する。各セルへの最短距離が一度の BFS で求まる。

### レベル順走査

> 二分木をレベルごとにまとめて出力せよ（[102. Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)）

`size := len(queue)` のテクニックで各レベルのノードをグループ化できる。

## 見極めるためのシグナル

- **最短**距離 / 最小ステップ数
- **レベル順**走査
- 全ノードから**最も近い**特定ノードへの距離
- 「**同時に**広がる」（腐るオレンジ、火災の伝播など）

「最短」が問われていなければ [DFS](/wiki/algorithms/dfs/) の方がコードが短いことが多い。

## よくある間違い

1. **訪問済みのタイミング**: キューに**追加する時**に訪問済みにする。取り出す時にすると同じノードが複数回キューに入り、TLE になる
2. **レベル区切りの忘れ**: ステップ数を求める場合、`size := len(queue)` でレベルを区切らないと正確な距離が出ない
3. **重み付きグラフへの誤用**: BFS は辺の重みが全て等しい場合のみ最短経路を保証する

## 関連

- [DFS (Depth-First Search)](/wiki/algorithms/dfs/) — 深さ優先探索。連結成分の数やバックトラックに強い
- [Topological Sort](/wiki/algorithms/topological-sort/) — Kahn's Algorithm は BFS を応用したトポロジカルソート
- [Sliding Window](/wiki/algorithms/sliding-window/) — 配列上の別の探索パターン

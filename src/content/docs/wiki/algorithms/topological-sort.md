---
title: Topological Sort
description: DAG の頂点を辺の向きに沿って並べる手法（タスクスケジューリング、ビルドシステム、履修順序）
sidebar:
  order: 9
---

## 概要

トポロジカルソートとは、有向非巡回グラフ（DAG: Directed Acyclic Graph）の頂点を**すべての辺が「前 → 後」の向きになるように一列に並べる**操作。

タスクスケジューリング、ビルドシステムの依存解決、履修科目の順序決定など、**依存関係のある要素を正しい順序で処理する**場面で使われる。

**前提条件:** グラフに閉路（サイクル）が存在しないこと。閉路があるとトポロジカル順序は定義できない。逆に言えば、トポロジカルソートが完了しない＝閉路が存在する、というサイクル検出にも使える。

## 核となるアイデア

主要なアプローチは 2 つある。

### Kahn's Algorithm（BFS + 入次数）

1. 各ノードの入次数（indegree）を計算する
2. 入次数が 0 のノードをキューに入れる
3. キューからノードを取り出し、結果に追加する
4. そのノードから出る辺を削除し、行き先の入次数を 1 減らす
5. 入次数が 0 になったノードをキューに入れる
6. キューが空になるまで繰り返す

全ノードを処理できれば有効なトポロジカル順序が得られる。処理できないノードが残ればサイクルが存在する。

```moonmaid
flowchart TD { A["各ノードの入次数を計算"] -> B["入次数 0 のノードをキューに入れる"] B -> C["キューからノードを取り出す"] C -> D["結果に追加"] D -> E["隣接ノードの入次数を -1"] E -> F{"入次数が 0 になった？"} F -> |"Yes"| G["キューに追加"] F -> |"No"| H{"キューが空？"} G -> H H -> |"No"| C H -> |"Yes"| I{"全ノード処理済み？"} I -> |"Yes"| J["トポロジカル順序完成"] I -> |"No"| K["サイクルが存在する"] }
```

### DFS ベース

1. 各ノードに対して DFS を行う
2. DFS の帰りがけ（postorder）でスタックに積む
3. スタックを逆順にすればトポロジカル順序になる

DFS ベースでは、訪問中のノードに再び到達した場合にサイクルを検出できる。

## テンプレート

### Kahn's Algorithm（BFS）

```go
func kahnTopologicalSort(numNodes int, edges [][]int) ([]int, bool) {
 graph := make([][]int, numNodes)
 indegree := make([]int, numNodes)
 for _, e := range edges {
  from, to := e[0], e[1]
  graph[from] = append(graph[from], to)
  indegree[to]++
 }

 // Enqueue all nodes with indegree 0
 queue := []int{}
 for i := 0; i < numNodes; i++ {
  if indegree[i] == 0 {
   queue = append(queue, i)
  }
 }

 order := []int{}
 for len(queue) > 0 {
  node := queue[0]
  queue = queue[1:]
  order = append(order, node)
  for _, neighbor := range graph[node] {
   indegree[neighbor]--
   if indegree[neighbor] == 0 {
    queue = append(queue, neighbor)
   }
  }
 }

 // If not all nodes are processed, a cycle exists
 if len(order) != numNodes {
  return nil, false
 }
 return order, true
}
```

### DFS ベース

```go
func dfsTopologicalSort(numNodes int, edges [][]int) ([]int, bool) {
 graph := make([][]int, numNodes)
 for _, e := range edges {
  from, to := e[0], e[1]
  graph[from] = append(graph[from], to)
 }

 const (
  unvisited = 0
  visiting  = 1 // currently in DFS stack (cycle detection)
  visited   = 2
 )
 state := make([]int, numNodes)
 result := make([]int, 0, numNodes)
 hasCycle := false

 var dfs func(node int)
 dfs = func(node int) {
  if hasCycle {
   return
  }
  state[node] = visiting
  for _, neighbor := range graph[node] {
   switch state[neighbor] {
   case visiting:
    hasCycle = true
    return
   case unvisited:
    dfs(neighbor)
   }
  }
  state[node] = visited
  result = append(result, node)
 }

 for i := 0; i < numNodes; i++ {
  if state[i] == unvisited {
   dfs(i)
  }
 }

 if hasCycle {
  return nil, false
 }

 // Reverse the result (postorder → topological order)
 for l, r := 0, len(result)-1; l < r; l, r = l+1, r-1 {
  result[l], result[r] = result[r], result[l]
 }
 return result, true
}
```

## 計算量

$V$ = 頂点数、$E$ = 辺数

| | 時間 | 空間 |
|---|---|---|
| Kahn's (BFS) | $O(V + E)$ | $O(V + E)$ |
| DFS ベース | $O(V + E)$ | $O(V + E)$ |

**時間:** 各ノードを 1 回処理し（$O(V)$）、各辺を 1 回走査する（$O(E)$）ため、合計 $O(V + E)$。

**空間:** 隣接リストの格納に $O(V + E)$。Kahn's ではキューに最大 $O(V)$ ノード、DFS では再帰スタックに最大 $O(V)$ の深さが必要。

## 実問題

### [207. Course Schedule](https://leetcode.com/problems/course-schedule/)

$n$ 個の科目と前提条件のリストが与えられる。すべての科目を履修できるか判定する問題。本質的には **DAG にサイクルがないか** を確認する問題。

**着眼点:** Kahn's Algorithm でトポロジカルソートし、全ノードを処理できたかチェックする。

```go
func canFinish(numCourses int, prerequisites [][]int) bool {
 graph := make([][]int, numCourses)
 indegree := make([]int, numCourses)
 for _, p := range prerequisites {
  course, prereq := p[0], p[1]
  graph[prereq] = append(graph[prereq], course)
  indegree[course]++
 }

 queue := []int{}
 for i := 0; i < numCourses; i++ {
  if indegree[i] == 0 {
   queue = append(queue, i)
  }
 }

 processed := 0
 for len(queue) > 0 {
  node := queue[0]
  queue = queue[1:]
  processed++
  for _, neighbor := range graph[node] {
   indegree[neighbor]--
   if indegree[neighbor] == 0 {
    queue = append(queue, neighbor)
   }
  }
 }

 return processed == numCourses
}
```

### [210. Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)

207 と同様の設定で、**履修順序を返す**問題。トポロジカルソートの結果そのもの。

```go
func findOrder(numCourses int, prerequisites [][]int) []int {
 graph := make([][]int, numCourses)
 indegree := make([]int, numCourses)
 for _, p := range prerequisites {
  course, prereq := p[0], p[1]
  graph[prereq] = append(graph[prereq], course)
  indegree[course]++
 }

 queue := []int{}
 for i := 0; i < numCourses; i++ {
  if indegree[i] == 0 {
   queue = append(queue, i)
  }
 }

 order := []int{}
 for len(queue) > 0 {
  node := queue[0]
  queue = queue[1:]
  order = append(order, node)
  for _, neighbor := range graph[node] {
   indegree[neighbor]--
   if indegree[neighbor] == 0 {
    queue = append(queue, neighbor)
   }
  }
 }

 if len(order) != numCourses {
  return []int{}
 }
 return order
}
```

### [269. Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) (Premium)

ソート済みの単語リストからエイリアン言語のアルファベット順を復元する問題。隣接する単語ペアから文字間の順序関係（辺）を抽出し、トポロジカルソートで全体の順序を決定する。

## 見極めるためのシグナル

- **前提条件**（prerequisites）や**依存関係**（dependencies）がある
- **順序を決定**する（ordering, scheduling）
- グラフが **DAG** であることが明示または暗示されている
- **サイクル検出**が求められている
- ビルド順序、コンパイル順序、タスクの実行順序

## よくある間違い

1. **サイクルチェックの忘れ**: トポロジカルソートは DAG でのみ成立する。サイクルがある場合の処理を忘れると不正解になる
2. **辺の向きの取り違え**: `[course, prereq]` で「prereq → course」なのか「course → prereq」なのか。問題文をよく読むこと
3. **孤立ノードの扱い**: 辺に登場しないノードも結果に含める必要がある。入次数 0 の初期化で拾えるが見落としやすい
4. **DFS の状態管理ミス**: `visiting` と `visited` の 2 状態を使わないとサイクル検出ができない。単純な `visited` フラグだけでは不十分

## 関連

- [DFS (Depth-First Search)](/wiki/algorithms/dfs/) — DFS ベースのトポロジカルソートの基礎
- [BFS (Breadth-First Search)](/wiki/algorithms/bfs/) — Kahn's Algorithm は BFS の応用
- [Dynamic Programming](/wiki/algorithms/dynamic-programming/) — DAG 上の DP はトポロジカル順序に沿って計算する

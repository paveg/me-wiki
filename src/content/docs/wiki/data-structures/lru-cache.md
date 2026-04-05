---
title: LRU Cache
description: HashMap + 双方向連結リストによる O(1) キャッシュの設計と実装
sidebar:
  order: 1
---

## 概要

LRU Cache（Least Recently Used Cache）は、容量制限付きのキャッシュで**最も長く使われていない要素を優先的に破棄する**データ構造。OS のページ置換、データベースのバッファプール、Web ブラウザのキャッシュなど、実システムで広く使われている。

面接では「$O(1)$ で Get/Put を実現するキャッシュを設計せよ」という形で出題され、**HashMap と双方向連結リストの組み合わせ**が定番の解法となる。

## 核となるデータ構造: HashMap + 双方向連結リスト

HashMap はキーからノードへの $O(1)$ ルックアップを提供し、双方向連結リストはアクセス順を管理する。リストの先頭が最近使われた要素、末尾が最も古い要素を表す。

```moonmaid
flowchart LR { HM["HashMap key → Node*"] H["Head (sentinel)"] -> N1["Node A key=1, val=10"] N1 -> H N1 -> N2["Node B key=2, val=20"] N2 -> N1 N2 -> N3["Node C key=3, val=30"] N3 -> N2 N3 -> T["Tail (sentinel)"] T -> N3 HM -> N1 [style=dashed] HM -> N2 [style=dashed] HM -> N3 [style=dashed] }
```

**Head 側が最近使用、Tail 側が最古。** Head/Tail はデータを持たないセンチネルノード[^1]。

[^1]: センチネルノードを使うと、リストの先頭・末尾での挿入・削除時に `nil` チェックの分岐が不要になり、コードが大幅に簡潔になる。

### Get / Put の流れ

```moonmaid
flowchart TD { G1["Get(key)"] -> G2{"cache に key がある？"} G2 -> |"Yes"| G3["ノードをリストから remove"] G3 -> G4["Head の直後に insertHead"] G4 -> G5["val を返す"] G2 -> |"No"| G6["-1 を返す"] P1["Put(key, val)"] -> P2{"cache に key がある？"} P2 -> |"Yes"| P3["val を更新"] P3 -> P4["remove → insertHead"] P2 -> |"No"| P5["新しい Node を作成"] P5 -> P6["cache に追加 + insertHead"] P6 -> P7{"容量を超えた？"} P7 -> |"Yes"| P8["Tail.prev を remove, cache から delete"] P7 -> |"No"| P9["完了"] }
```

## 計算量

| 操作 | 時間 | 空間 |
|---|---|---|
| Get | $O(1)$ | — |
| Put | $O(1)$ | — |
| 全体 | — | $O(\text{capacity})$ |

**なぜ $O(1)$ か:**

- **Get**: HashMap のルックアップが $O(1)$。ノードの remove / insertHead は前後のポインタを付け替えるだけなので $O(1)$
- **Put**: 同上。容量超過時の削除も `tail.prev` への直接アクセスなので $O(1)$

## なぜ HashMap + 双方向連結リスト？

| 代替案 | Get | Put (更新) | 削除 (LRU) | 問題点 |
|---|---|---|---|---|
| 配列 + HashMap | $O(1)$ | $O(n)$ | $O(n)$ | 要素の移動にシフトが必要 |
| 単方向連結リスト + HashMap | $O(1)$ | $O(n)$ | $O(1)$ | 前のノードを辿れないため remove が $O(n)$ |
| OrderedDict (Python) | $O(1)$ | $O(1)$ | $O(1)$ | 言語組み込みに依存。面接では内部構造の理解を求められる |
| **双方向連結リスト + HashMap** | **$O(1)$** | **$O(1)$** | **$O(1)$** | **全操作が $O(1)$** |

双方向連結リストでは `node.prev` に直接アクセスできるため、**任意のノードの削除が $O(1)$** で行える。これが単方向連結リストとの決定的な違い。

## 実問題での適用

### [146. LRU Cache](https://leetcode.com/problems/lru-cache/)

容量 `capacity` の LRU Cache を実装し、`Get` と `Put` を $O(1)$ で動作させる。

```go
type Node struct {
 key, val   int
 prev, next *Node
}

type LRUCache struct {
 cap        int
 cache      map[int]*Node
 head, tail *Node
}

func Constructor(capacity int) LRUCache {
 head := &Node{}
 tail := &Node{}
 head.next = tail
 tail.prev = head
 return LRUCache{cap: capacity, cache: make(map[int]*Node, capacity), head: head, tail: tail}
}

func (l *LRUCache) remove(node *Node) {
 node.prev.next = node.next
 node.next.prev = node.prev
}

func (l *LRUCache) insertHead(node *Node) {
 node.next = l.head.next
 node.prev = l.head
 l.head.next.prev = node
 l.head.next = node
}

func (this *LRUCache) Get(key int) int {
 if node, ok := this.cache[key]; ok {
  this.remove(node)
  this.insertHead(node)
  return node.val
 }
 return -1
}

func (this *LRUCache) Put(key int, value int) {
 if node, ok := this.cache[key]; ok {
  node.val = value
  this.remove(node)
  this.insertHead(node)
  return
 }
 node := &Node{key: key, val: value}
 this.cache[key] = node
 this.insertHead(node)
 if len(this.cache) > this.cap {
  lru := this.tail.prev
  this.remove(lru)
  delete(this.cache, lru.key)
 }
}
```

**ポイント:**

- **センチネルノード**: `head` と `tail` はデータを持たないダミーノード。リストが空の場合や先頭・末尾での操作時に `nil` チェックが不要になる
- **Node が key を保持する理由**: 容量超過時に `tail.prev` を削除する際、HashMap からも `delete(this.cache, lru.key)` する必要がある。Node に key がないと HashMap のどのエントリを消すべきか分からない[^2]
- **remove + insertHead**: Get でも Put でも、アクセスされたノードを「最近使った」位置（Head の直後）に移動するために、一度 remove してから insertHead する

[^2]: これは面接で頻出の質問。「なぜ Node に key を持たせるのか？」と問われたら、eviction 時に HashMap からの削除に必要だと答える。

## 見極めるためのシグナル

- 「キャッシュを設計せよ」「容量制限付きの key-value ストア」
- 「$O(1)$ で Get/Put」が要件に含まれる
- 「最も古いデータを破棄する」（LRU ポリシー）
- システムデザインの面接で「キャッシュレイヤーをどう実装するか」

## よくある間違い

1. **センチネルノードを使わない**: `head` / `tail` が `nil` になるケースの分岐が複雑化し、バグの温床になる
2. **HashMap からの削除忘れ**: eviction 時に `remove(lru)` だけして `delete(this.cache, lru.key)` を忘れると、HashMap にゴーストエントリが残る
3. **既存キーの Put で重複ノード作成**: 既に存在するキーに Put する場合、値を更新して移動するだけでよい。新しい Node を作ると容量管理が壊れる
4. **insertHead のポインタ更新順序**: 4本のポインタを正しい順序で付け替えないとリストが壊れる。紙に図を描いて確認すること

## 関連

- [Linked List](/wiki/data-structures/linked-list/) — 連結リストの反転・マージ・サイクル検出
- [DFS (Depth-First Search)](/wiki/algorithms/dfs/) — グラフ・グリッド探索の基本手法
- [Sliding Window](/wiki/algorithms/sliding-window/) — 配列上の別の探索パターン
- [BFS (Breadth-First Search)](/wiki/algorithms/bfs/) — 幅優先探索

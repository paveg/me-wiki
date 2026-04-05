---
title: 数学の基礎
description: コーディング面接に必要な数学の基礎知識（文系出身者向け）
sidebar:
  order: 1
---

コーディング面接で頻出する数学の基礎知識を、直感的に理解できるようにまとめます。形式的な証明ではなく、「なぜそうなるのか」を具体例で説明します。

## 対数（Logarithms）

### $\log_2 n$ とは何か？

一言でいうと、**「$n$ を何回 2 で割ったら 1 になるか？」** です。

例えば $\log_2 1024 = 10$ は、1024 を 2 で 10 回割ると 1 になるということです。

$$1024 \to 512 \to 256 \to 128 \to 64 \to 32 \to 16 \to 8 \to 4 \to 2 \to 1$$

### なぜ二分探索は $O(\log n)$ なのか？

二分探索は毎回探索範囲を半分にします。$n$ 個の要素がある場合、何回半分にすれば 1 個になるか？ → $\log_2 n$ 回です。

### なぜヒープ操作は $O(\log n)$ なのか？

ヒープは完全二分木です。$n$ 個のノードがある木の高さは $\log_2 n$ です。挿入や削除は木の高さ分だけ操作が必要なので $O(\log n)$ になります。

### よく使う対数の値

| $n$ | $\log_2 n$（おおよそ） |
|---|---|
| $1{,}000$ | $\approx 10$ |
| $1{,}000{,}000$（$10^6$） | $\approx 20$ |
| $1{,}000{,}000{,}000$（$10^9$） | $\approx 30$ |

この表は非常に重要です。入力が $10^9$ でも、$O(\log n)$ なら約 30 回の操作で済みます。

**関連ページ**: [二分探索](/wiki/algorithms/binary-search/)、[ヒープ](/wiki/data-structures/heap/)、[二分木](/wiki/data-structures/binary-tree/)

---

## 剰余演算（Modular Arithmetic）

### なぜ $10^9+7$ で mod を取るのか？

組合せ問題などでは、答えが天文学的な数になることがあります。たとえば $100!$ は 158 桁の数です。これをそのまま扱うと整数オーバーフローが起きます。

$10^9+7$（= $1{,}000{,}000{,}007$）は**素数**です。素数であることにより、モジュラー逆元（割り算の代わり）が使えるなど数学的に扱いやすくなります。

### 基本ルール

足し算と掛け算は、途中で mod を取っても結果は同じです。

$$(a + b) \bmod m = ((a \bmod m) + (b \bmod m)) \bmod m$$

$$(a \times b) \bmod m = ((a \bmod m) \times (b \bmod m)) \bmod m$$

### 引き算の罠

引き算では結果が負になる可能性があります。

$$(a - b) \bmod m$$

$a < b$ のとき結果が負になるので、**$m$ を足してから mod を取る**のが安全です。

$$(a - b + m) \bmod m$$

### Go コード例：経路数の計算

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

### よくあるミス

中間結果で mod を取り忘れると、64 ビット整数でもオーバーフローします。**掛け算の都度 mod を取る**習慣をつけましょう。

---

## 組合せ・順列（Combinations & Permutations）

### 順列（Permutation）：順番が重要

$n$ 個のものを並べる方法は $n!$（$n$ の階乗）通りです。

$$n! = n \times (n-1) \times (n-2) \times \cdots \times 1$$

例：3 人を一列に並べる → $3! = 3 \times 2 \times 1 = 6$ 通り

### 組合せ（Combination）：順番は関係ない

$n$ 個から $k$ 個を選ぶ方法は $\binom{n}{k}$ 通りです。

$$\binom{n}{k} = \frac{n!}{k!(n-k)!}$$

例：5 人から 3 人を選ぶ → $\binom{5}{3} = \frac{5!}{3! \times 2!} = \frac{120}{6 \times 2} = 10$ 通り

### バックトラッキングとの関係

- 全部分集合を列挙 → $2^n$ 個（各要素を「選ぶ or 選ばない」の 2 択）
- 全順列を列挙 → $n!$ 個

入力サイズ $n$ が大きいと爆発的に増えるため、枝刈り（プルーニング）が重要です。

### パスカルの三角形

$$\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$$

この漸化式は DP で組合せの値を計算するときに非常に便利です。直接 $n!$ を計算するとオーバーフローしやすいですが、パスカルの三角形を使えば加算だけで求められます。

**関連ページ**: [バックトラッキング](/wiki/algorithms/backtracking/)、[動的計画法](/wiki/algorithms/dynamic-programming/)

---

## ビット演算（Bit Operations）

### 基本演算

| 演算 | 記号 | 例 | 結果 |
|---|---|---|---|
| AND | `&` | `0b1100 & 0b1010` | `0b1000`（8） |
| OR | `\|` | `0b1100 \| 0b1010` | `0b1110`（14） |
| XOR | `^` | `0b1100 ^ 0b1010` | `0b0110`（6） |
| NOT | `^`（Go） | `^0b1100`（uint） | ビット反転 |
| 左シフト | `<<` | `1 << 3` | `8`（$2^3$） |
| 右シフト | `>>` | `8 >> 2` | `2`（$8 \div 4$） |

### XOR のトリック

XOR には便利な性質があります。

- $a \oplus a = 0$（同じ値の XOR は 0）
- $a \oplus 0 = a$（0 との XOR は元の値）

これを使うと、「配列の中で 1 つだけ出現する数」を $O(n)$ 時間、$O(1)$ 空間で見つけられます。

### 2 のべき乗判定

$n$ が 2 のべき乗かどうかは、以下の式で判定できます。

```go
n > 0 && n&(n-1) == 0
```

2 のべき乗の二進数表現は `1` が 1 つだけです（例: $8 = 1000_2$）。$n-1$ は下位ビットがすべて反転するので（$7 = 0111_2$）、AND を取ると 0 になります。

### セットビットのカウント（Brian Kernighan のアルゴリズム）

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

`n & (n-1)` は最下位のセットビットを 1 つ消します。何回消せるか＝セットビットの数です。

### LeetCode 136. Single Number

配列の中で 1 つだけ出現する要素を見つける問題です。

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

## 計算量の直感（Complexity Intuition）

面接で最も実用的なヒューリスティック：**入力サイズから使える計算量を逆算する**。

一般的な競技プログラミングの制限時間（1〜2 秒）では、約 $10^8$ 回の操作が限界です。

| $n$ の範囲 | 使える計算量 | 典型例 |
|---|---|---|
| $\leq 10$ | $O(n!)$ | 順列全探索 |
| $\leq 20$ | $O(2^n)$ | 部分集合全探索 |
| $\leq 500$ | $O(n^3)$ | Floyd-Warshall |
| $\leq 5{,}000$ | $O(n^2)$ | ナイーブな DP |
| $\leq 10^6$ | $O(n \log n)$ | ソート |
| $\leq 10^8$ | $O(n)$ | 線形走査 |
| $> 10^8$ | $O(\log n)$ or $O(1)$ | 二分探索、数学 |

### 最も重要なヒューリスティック

> 入力が $10^5$ なら、$O(n \log n)$ 以下のアルゴリズムが必要。

この 1 行を覚えるだけで、面接中に「どのアルゴリズムを使うべきか」の見当がつきます。$n$ の制約を見て、上の表と照らし合わせましょう。

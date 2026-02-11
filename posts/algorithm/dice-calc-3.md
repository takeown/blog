---
title: "[프로그래머스]주사위 게임 3"
excerpt: 문주사위 게임 3
image: algo.png
isFeatured: false
date: "2026-02-11"
---


### 풀이
정렬을 먼저해서 풀이하기 용이하게 함.

```
function solution(a, b, c, d) {
  const dice = [a, b, c, d].sort((x, y) => x - y);

  const [x1, x2, x3, x4] = dice;

  // 모두 같음
  if (x1 === x4) {
    return 1111 * x1;
  }

  // 세 개 같음 (앞 3개 or 뒤 3개)
  if (x1 === x3 || x2 === x4) {
    const p = x2; // 세 개 공통값
    const q = x1 === x3 ? x4 : x1;
    return (10 * p + q) ** 2;
  }

  //  두 개씩 같은 경우
  if (x1 === x2 && x3 === x4) {
    return (x1 + x3) * Math.abs(x1 - x3);
  }

  //  두 개만 같은 경우
  if (x1 === x2) return x3 * x4;
  if (x2 === x3) return x1 * x4;
  if (x3 === x4) return x1 * x2;

  // 모두 다름
  return x1;
}
```

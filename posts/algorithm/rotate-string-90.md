---
title: "[프로그래머스] 문자열 뒤집기 - 90도 회전"
excerpt: 문자열을 시계방향 90도 회전하여 출력하기
image: algo.png
isFeatured: false
date: "2026-02-09"
---

## 문제

문자열 `my_string`이 주어졌을 때, 문자열을 시계방향으로 90도 회전시켜서 출력하는 문제입니다.

### 제한사항

- 1 ≤ my_string.length ≤ 10

### 입출력 예

| my_string | result |
|-----------|--------|
| "abcde"   | a<br>b<br>c<br>d<br>e |

입력이 `"abcde"`일 때, 시계방향 90도 회전하면 각 문자가 세로로 출력됩니다.

## 풀이

문자열을 시계방향 90도 회전한다는 것은 가로로 나열된 문자들을 세로로 출력하는 것입니다.

즉, 문자열의 각 문자를 한 줄씩 출력하면 됩니다.

JavaScript에서는 다음과 같은 방법을 사용할 수 있습니다:

1. **split과 join 활용**: 문자열을 배열로 분리한 후 줄바꿈 문자로 합치기
2. **전개 연산자 활용**: `[...str]`로 문자 배열을 만든 후 줄바꿈으로 연결

## 코드

```js
function solution(my_string) {
    return [...my_string].join('\n');
}
```

### 코드 설명

1. `[...my_string]`: 전개 연산자를 사용해 문자열을 개별 문자 배열로 변환
   - `"abcde"` → `['a', 'b', 'c', 'd', 'e']`
2. `.join('\n')`: 배열의 각 요소를 줄바꿈 문자(`\n`)로 연결
   - `['a', 'b', 'c', 'd', 'e']` → `"a\nb\nc\nd\ne"`

### 다른 풀이

```js
// split 사용
function solution(my_string) {
    return my_string.split('').join('\n');
}

// Array.from 사용
function solution(my_string) {
    return Array.from(my_string).join('\n');
}
```

모두 같은 결과를 출력합니다. 취향에 맞게 선택하면 됩니다.

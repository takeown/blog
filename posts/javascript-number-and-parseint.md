---
title: "javascript Number and parseInt"
date: "2025-12-15"
image: javascript-logo.png
excerpt: JS Number 와 parseInt 차이
isFeatured: true
---

JavaScript에서 문자열을 숫자로 변환하는 방법은 여러 가지가 있습니다. 그 중에서도 `Number()`와 `parseInt()`는 가장 많이 사용되는 방법인데요, 비슷해 보이지만 중요한 차이점들이 있습니다. 자주 쓰이는 만큼 한 번 정리하여 블로깅합니다.

## 기본 사용법

```js
Number("123");    // 123
parseInt("123");  // 123
```

언뜻 보면 동일한 결과를 반환하는 것 같지만, 실제로는 여러 상황에서 다르게 동작합니다.

## 주요 차이점

### 1. 부분 문자열 파싱

가장 큰 차이점은 문자열의 일부만 숫자인 경우입니다.

```js
Number("123abc");    // NaN
parseInt("123abc");  // 123
```

- `Number()`는 전체 문자열이 유효한 숫자여야 합니다
- `parseInt()`는 문자열의 앞부분부터 숫자를 파싱하다가 숫자가 아닌 문자를 만나면 멈춥니다

### 2. 빈 문자열과 공백

```js
Number("");         // 0
parseInt("");       // NaN

Number("   ");      // 0
parseInt("   ");    // NaN
```

- `Number()`는 빈 문자열이나 공백만 있는 문자열을 0으로 변환합니다
- `parseInt()`는 NaN을 반환합니다

### 3. 진법(Radix) 지정

`parseInt()`는 두 번째 인자로 진법을 지정할 수 있습니다.

```js
parseInt("10", 2);   // 2 (2진법)
parseInt("10", 8);   // 8 (8진법)
parseInt("10", 10);  // 10 (10진법)
parseInt("10", 16);  // 16 (16진법)

parseInt("FF", 16);  // 255
```

`Number()`는 진법 지정이 불가능하며, 항상 10진법으로 파싱합니다.

### 4. 소수점 처리

```js
Number("123.45");    // 123.45
parseInt("123.45");  // 123
```

- `Number()`는 소수점을 그대로 유지합니다
- `parseInt()`는 정수 부분만 반환합니다 (소수점 이하 버림)

소수점을 포함한 파싱이 필요하다면 `parseFloat()`를 사용해야 합니다.

```js
parseFloat("123.45");  // 123.45
```

### 5. 특수 값 처리

```js
Number(null);        // 0
parseInt(null);      // NaN

Number(undefined);   // NaN
parseInt(undefined); // NaN

Number(true);        // 1
parseInt(true);      // NaN
```

### 6. 16진수 표기법

```js
Number("0x10");      // 16
parseInt("0x10");    // 16
parseInt("0x10", 16); // 16
parseInt("0x10", 10); // 0 (10진법으로 파싱 시도하므로)
```

두 함수 모두 `0x` 접두사가 있는 16진수를 인식하지만, `parseInt()`에서 명시적으로 진법을 지정하면 다르게 동작할 수 있습니다.

## 언제 무엇을 사용해야 할까?

### Number()를 사용하는 경우

- 전체 문자열이 유효한 숫자인지 확인하고 싶을 때
- 소수점을 포함한 숫자를 다룰 때
- 불린 값이나 null을 숫자로 변환할 때
- 더 엄격한 파싱이 필요할 때

```js
const input = "123.45";
const num = Number(input);
if (!isNaN(num)) {
  console.log("유효한 숫자:", num);
}
```

### parseInt()를 사용하는 경우

- 문자열 앞부분의 정수만 필요할 때
- 특정 진법의 숫자를 파싱할 때
- CSS 값 등 "100px"처럼 숫자 뒤에 단위가 붙은 문자열을 파싱할 때
- 정수만 필요할 때

```js
const cssWidth = "100px";
const width = parseInt(cssWidth); // 100

const hexColor = "FF";
const decimal = parseInt(hexColor, 16); // 255
```

## 성능 비교

일반적으로 `Number()`가 `parseInt()`보다 약간 더 빠릅니다. 하지만 대부분의 경우 성능 차이는 미미하므로, 상황에 맞는 함수를 선택하는 것이 더 중요합니다.

## 베스트 프랙티스

1. **항상 parseInt()의 두 번째 인자(radix)를 명시하세요**

   ```js
   parseInt("08", 10);  // 8 (권장)
   parseInt("08");      // 8 (ES5 이후는 안전하지만 명시적이 좋음)
   ```

2. **유효성 검사를 함께 사용하세요**

   ```js
   const num = Number(input);
   if (isNaN(num)) {
     console.error("유효하지 않은 숫자입니다");
   }
   ```

3. **단항 플러스 연산자(`+`)는 Number()와 동일합니다**

   ```js
   +"123"    // 123 (Number("123")와 동일)
   +"123abc" // NaN
   ```

## 결론

`Number()`와 `parseInt()`는 각자의 용도가 있습니다:

- **Number()**: 엄격한 숫자 변환, 소수점 유지, 전체 문자열 검증
- **parseInt()**: 유연한 정수 파싱, 진법 지정, 부분 문자열 처리

프로젝트의 요구사항에 맞는 함수를 선택하여 사용하면, 예상치 못한 버그를 방지하고 더 견고한 코드를 작성할 수 있습니다.

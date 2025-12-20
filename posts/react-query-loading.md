---
title: "react-query-loading"
date: "2025-12-20"
image: getting-started-nextjs.png
excerpt: react-query isLoading 과 isPending의 차이
isFeatured: true
---

# React Query의 로딩 상태 가이드

React Query를 사용하다 보면 `isLoading`, `isPending`, `isFetching` 등 여러 로딩 상태 플래그를 만나게 됩니다. 이들의 차이를 정확히 이해하지 못하면 잘못된 로딩 UI를 보여줄 수 있습니다. 이 글에서는 각 상태의 의미와 실제 사용 사례를 알아보겠습니다.

## isPending vs isLoading

React Query v5부터 `isLoading`의 의미가 변경되고 `isPending`이 새롭게 도입되었습니다.

### isPending

**쿼리에 아직 데이터가 없는 상태**를 나타냅니다.

```typescript
const { data, isPending } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
});

if (isPending) {
  return <div>로딩 중...</div>;
}
```

`isPending`은 다음 조건을 모두 만족할 때 `true`입니다:
- 캐시에 데이터가 없음
- 현재 쿼리가 실행 중이거나 idle 상태

### isLoading (v5)

**데이터가 없으면서 동시에 fetching 중인 상태**를 나타냅니다.

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
});

// isLoading = isPending && isFetching
```

실제로 `isLoading`은 `isPending && isFetching`과 동일합니다. 즉, 캐시에 데이터가 없고 현재 데이터를 가져오는 중일 때만 `true`입니다.

## isFetching

**쿼리가 현재 실행 중인지** 여부를 나타냅니다. 캐시 데이터 유무와 관계없이 네트워크 요청이 진행 중이면 `true`입니다.

```typescript
const { data, isFetching } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  refetchInterval: 5000, // 5초마다 자동 refetch
});

// 백그라운드에서 refetch 중일 때
// data: ✅ (이전 데이터 존재)
// isFetching: true
// isPending: false
// isLoading: false
```

## 실전 사용 사례

### 초기 로딩 스피너

사용자가 처음 페이지에 진입했을 때 전체 화면 로딩을 보여주려면 `isPending`을 사용합니다.

```typescript
function TodoList() {
  const { data, isPending, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  if (isPending) {
    return <FullScreenSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return <TodoItems todos={data} />;
}
```

### 백그라운드 리프레시 표시

데이터가 있는 상태에서 백그라운드로 새로고침될 때 작은 인디케이터를 보여주려면 `isFetching`을 사용합니다.

```typescript
function TodoList() {
  const { data, isPending, isFetching, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    refetchInterval: 10000,
  });

  if (isPending) {
    return <FullScreenSpinner />;
  }

  return (
    <div>
      {isFetching && <RefreshIcon className="spin" />}
      <TodoItems todos={data} />
    </div>
  );
}
```

### Skeleton UI 패턴

Skeleton UI를 보여줄 때는 `isPending`을 사용합니다.

```typescript
function UserProfile() {
  const { data, isPending } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  return (
    <div>
      {isPending ? (
        <ProfileSkeleton />
      ) : (
        <Profile user={data} />
      )}
    </div>
  );
}
```

## v4에서 v5로 마이그레이션

React Query v4에서는 `isLoading`이 현재 v5의 `isPending`과 같은 의미였습니다.

```typescript
// v4
if (isLoading) {
  return <Spinner />;
}

// v5로 마이그레이션
if (isPending) {
  return <Spinner />;
}
```

### v5에서 isLoading을 사용할 때 주의사항

v5에서도 `isLoading`을 사용할 수 있지만, v4와 의미가 완전히 달라졌습니다. v5의 `isLoading`은 `isPending && isFetching`과 동일하므로, 특정 상황에서 예상과 다르게 동작할 수 있습니다.

**문제가 되는 케이스: enabled 옵션을 사용하는 경우**

```typescript
const [userId, setUserId] = useState<string | null>(null);

const { data, isLoading, isPending } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId!),
  enabled: !!userId, // userId가 있을 때만 쿼리 실행
});

// 상황: userId가 아직 null일 때
// isPending: true ✅ (데이터가 없음)
// isFetching: false (쿼리가 비활성화됨)
// isLoading: false ❌ (isPending && isFetching = true && false = false)

if (isLoading) {
  // 이 코드는 실행되지 않음!
  return <Spinner />;
}
```

위 예시에서 `isLoading`을 사용하면 쿼리가 비활성화된 상태에서는 로딩 스피너가 표시되지 않습니다. 하지만 `isPending`을 사용하면 "아직 데이터가 없는 상태"를 올바르게 감지할 수 있습니다.

**권장사항**

```typescript
// ❌ v5에서 isLoading 사용 (혼란스러움)
if (isLoading) return <Spinner />;

// ✅ isPending 사용 (명확함)
if (isPending) return <Spinner />;

// ✅ 또는 명시적으로 조건 작성
if (isPending && isFetching) return <Spinner />;
```

대부분의 경우 초기 로딩 UI를 표시하려면 **"데이터가 있는가?"**를 확인하는 것이 목적이므로 `isPending`을 사용하는 것이 의도를 더 명확하게 표현합니다.

## 요약

| 상태 | 의미 | 사용 시기 |
|------|------|-----------|
| `isPending` | 데이터가 없는 상태 | 초기 로딩 UI 표시 |
| `isLoading` | 데이터가 없고 fetching 중 | isPending && isFetching |
| `isFetching` | 네트워크 요청 진행 중 | 백그라운드 리프레시 표시 |

대부분의 경우 **초기 로딩에는 `isPending`**, **백그라운드 리프레시 표시에는 `isFetching`**을 사용하면 됩니다.

## 참고 자료

- [React Query v5 Migration Guide](https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5)
- [React Query Loading States](https://tanstack.com/query/latest/docs/react/guides/queries)

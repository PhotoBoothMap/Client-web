/**
 * Object deep copy
 */
export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Set 을 위한 toggle 함수
 */
export function toggleSet(set: Set<any>, element: any) {
  if (set.has(element)) {
    set.delete(element);
  } else {
    set.add(element);
  }

  return set;
}

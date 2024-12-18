import type { Join } from 'type-fest';

export function getTags<const T extends ReadonlyArray<string>>(tags?: T) {
  return ['typescript', ...(tags ?? [])].join(
    ','
  ) as `typescript,${T extends ReadonlyArray<string> ? Join<T, ','> : ''}`;
}

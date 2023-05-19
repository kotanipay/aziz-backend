import { RequestContext } from '@medibloc/nestjs-request-context';

// AsyncLocalStorage version
export function getAppContextALS<T>(): T {
  return RequestContext.get<T>();
}

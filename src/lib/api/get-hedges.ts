import { PaginatedResult } from '../../models/paginated-result';
import { Hedge } from '../../models/hedge';

export function getHedges(): Promise<PaginatedResult<Hedge>> {
  return fetch(`${process.env.REACT_APP_API_URL ?? ''}/hedges`)
    .then(data => data.json());
}
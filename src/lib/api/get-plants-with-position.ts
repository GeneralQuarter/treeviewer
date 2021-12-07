import { PaginatedResult } from '../../models/paginated-result';
import { Plant } from '../../models/plant';

export function getPlantsWithPosition(): Promise<PaginatedResult<Plant>> {
  return fetch(`${process.env.REACT_APP_API_URL ?? ''}/plants-with-position`).then(data => data.json());
}
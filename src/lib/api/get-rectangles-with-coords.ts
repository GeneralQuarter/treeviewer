import { PaginatedResult } from '../../models/paginated-result';
import { Rectangle } from '../../models/rectangle';

export function getRectanglesWithCoords(): Promise<PaginatedResult<Rectangle>> {
  return fetch(`${process.env.REACT_APP_API_URL ?? ''}/rectangles-with-coords`)
    .then(data => data.json());
}
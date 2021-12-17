import { Tags } from '../../models/tags';

export function getTags(): Promise<Tags> {
  return fetch(`${process.env.REACT_APP_API_URL ?? ''}/tags`).then(res => res.json());
}
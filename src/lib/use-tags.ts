import { Tags } from '../models/tags';
import { getTags } from './api/get-tags';
import { useAPICall, UseAPICall } from './use-api-call';

export function useTags(): UseAPICall<Tags> {
  return useAPICall('tags', {}, getTags);
}
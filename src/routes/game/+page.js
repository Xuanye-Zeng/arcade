import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

// The crossword lived here in Project 1, so old links still work.
export function load() {
  redirect(308, `${base}/crossword/`);
}

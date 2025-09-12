export let posts = [];

export async function getPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!res.ok) throw new Error("Failed to fetch posts");
  posts = await res.json();
}

export function createPost(post) {
  post.id = posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1;
  posts.unshift(post);
}

export function updatePost(updatedPost) {
  posts = posts.map(p => (p.id === updatedPost.id ? updatedPost : p));
}

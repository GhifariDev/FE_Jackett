// src/lib/api.ts
export async function apiFetch(url: string, options: RequestInit = {}) {
  const base = 'https://feaea59b-29c1-410d-876c-82ef3311a0c5-00-2j44gkrr7d6ab.pike.replit.dev'; // backend kamu

  const res = await fetch(`${base}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include', // ⬅️ penting untuk cookie-based auth
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Something went wrong');
  }

  return res.json();
}

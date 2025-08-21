// src/lib/api.ts
export async function apiFetch(url: string, options: RequestInit = {}) {
  const base = 'http://localhost:3001'; // backend kamu

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

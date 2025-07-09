interface LoginData {
  identifier: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export async function login({ identifier, password }: LoginData) {
  const res = await fetch("https://spesialsayurdb-production-b3b4.up.railway.app/api/auth/local", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  return res.json();
}

export async function register({ username, email, password }: RegisterData) {
  const res = await fetch("https://spesialsayurdb-production-b3b4.up.railway.app/api/auth/local/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
}

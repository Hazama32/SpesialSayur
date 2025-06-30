import { getStrapiURL } from "@/lib/utils";

interface RegisterUserProps {
  username: string;
  password: string;
  email: string;
}

interface UpdateUserProps {
  userId: number;
  jwt: string;
  kategori_user: string;
  alamat_pengiriman: string;
  nomor_telepon: number;
  point: number;
}

interface LoginUserProps {
  identifier: string;
  password: string;
}

const baseUrl = getStrapiURL();

export async function registerUserService(data: RegisterUserProps) {
  const url = new URL("/api/auth/local/register", baseUrl);

  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // hanya username, email, password
    });

    return await res.json();
  } catch (err) {
    console.error("Register error:", err);
    return null;
  }
}

export async function updateUserAfterRegister(data: UpdateUserProps) {
  const url = new URL(`/api/users/${data.userId}`, baseUrl);

  try {
    const res = await fetch(url.toString(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.jwt}`,
      },
      body: JSON.stringify({
        kategori_user: data.kategori_user,
        alamat_pengiriman: data.alamat_pengiriman,
        nomor_telepon: data.nomor_telepon,
        point: data.point,
      }),
    });

    return await res.json();
  } catch (err) {
    console.error("Update user error:", err);
    return null;
  }
}

export async function loginUserService(data: LoginUserProps) {
  const url = new URL("/api/auth/local", baseUrl);

  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error("Login error:", err);
    return null;
  }
}

"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  registerUserService,
  updateUserAfterRegister,
  loginUserService,
} from "@/data/services/auth-service";

const config = {
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

// ✅ TIDAK DIUBAH: SCHEMA REGISTER
const schemaRegister = z.object({
  username: z.string().min(3).max(20, {
    message: "Username must be between 3 and 20 characters",
  }),
  password: z.string().min(6).max(100, {
    message: "Password must be between 6 and 100 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  nomor_telepon: z
    .string()
    .min(8, { message: "Nomor telepon wajib diisi dengan nomor aktif" })
    .regex(/^\d+$/, { message: "Nomor telepon hanya boleh angka" }),
});

// ✅ REGISTER USER ACTION
export async function registerUserAction(prevState: any, formData: FormData) {
  console.log("FormData:", {
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
    nomor_telepon: formData.get("nomor_telepon"),
  });

  const validated = schemaRegister.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
    nomor_telepon: formData.get("nomor_telepon"),
  });

  if (!validated.success) {
    console.log("Zod validation failed:", validated.error.flatten().fieldErrors);
    return {
      ...prevState,
      zodErrors: validated.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }

  const registerResponse = await registerUserService({
    username: validated.data.username,
    password: validated.data.password,
    email: validated.data.email,
  });

  console.log("Register Response:", registerResponse);

  if (!registerResponse || registerResponse.error || !registerResponse.user) {
    console.error("Register failed:", registerResponse);
    return {
      ...prevState,
      strapiErrors: registerResponse?.message || "Gagal register.",
      zodErrors: null,
      message: "Register failed.",
    };
  }

  // ✅ Update tambahan field user (jika ada)
  await updateUserAfterRegister({
    userId: registerResponse.user.id,
    jwt: registerResponse.jwt,
    kategori_user: formData.get("kategori_user") as string,
    alamat_pengiriman: formData.get("alamat_pengiriman") as string,
    nomor_telepon: parseInt(validated.data.nomor_telepon, 10),
    point: 0,
  });

  // ✅ Simpan JWT ke cookie
  const cookieStore = await cookies();
  cookieStore.set("jwt", registerResponse.jwt, config);

  redirect("/dashboard");
}

// ✅ SCHEMA LOGIN
const schemaLogin = z.object({
  identifier: z.string().min(3).max(20),
  password: z.string().min(6).max(100),
});

export async function loginUserAction(prevState: any, formData: FormData) {
  const validatedFields = schemaLogin.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Login.",
    };
  }

  const responseData = await loginUserService(validatedFields.data);

  if (!responseData || responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData?.error?.message || "Login failed",
      zodErrors: null,
      message: "Failed to Login.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, config);

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set("jwt", "", { ...config, maxAge: 0 });
  redirect("/");
}
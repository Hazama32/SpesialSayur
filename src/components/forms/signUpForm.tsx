"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { useState } from "react";
import { MapPin } from "lucide-react"
import LocationPopup from "@/components/LocationPopup";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { registerUserAction } from "@/data/actions/auth-action";
import { ZodErrors } from "../zodError";
import { StrapiErrors } from "../strapiError";

const INITIAL_STATE = {
  data: null,
  ZodErrors: null,
  message: null
}

export function SignupForm() {
  const [formState, formAction] = useFormState(registerUserAction, INITIAL_STATE);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [alamatFromMaps, setAlamatFromMaps] = useState('');


  return (
    <div className="w-full max-w-md">
      <form action={formAction}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" type="text" placeholder="username" />
              <ZodErrors error={formState?.zodErrors?.username} />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="name@example.com" />
              <ZodErrors error={formState?.zodErrors?.email} />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Masukan Password" />
              <ZodErrors error={formState?.zodErrors?.password} />
            </div>

            {/* nomor telepon */}
            <div className="space-y-2">
              <Label htmlFor="nomor_telepon">Nomor Telepon</Label>
              <Input id="nomor_telepon" name="nomor_telepon" type="number" placeholder="Nomor Telepon Aktif" />
              <ZodErrors error={formState?.zodErrors?.nomor_telepon} />
            </div>

            {/* Kategori User */}
            <div className="space-y-2">
              <Label>Kategori User</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="kategori_user"
                  value="Pribadi"
                  defaultChecked
                  required
                  />
                  Pribadi
                </label>

                <label className="flex items-center gap-2">
                  <input type="radio" name="kategori_user" value="Usaha" />
                  Usaha
                </label>
              </div>
            </div>

            {/* Alamat */}
            <div className="space-y-2">
              <Label htmlFor="alamat_pengiriman">Alamat Pengiriman</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="alamat_pengiriman"
                  name="alamat_pengiriman"
                  type="text"
                  placeholder="Alamat Pengiriman"
                  value={alamatFromMaps}
                  onChange={(e) => setAlamatFromMaps(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLocationPopup(true)}
                  className="p-2 rounded bg-green-100 hover:bg-green-200 border border-green-300"
                  aria-label="Ambil lokasi dari maps"
                >
                  <MapPin className="h-5 w-5 text-green-700" />
                </button>
              </div>
            </div>

            {showLocationPopup && (
              <LocationPopup
                onConfirm={(alamat) => {
                  setAlamatFromMaps(alamat);
                  setShowLocationPopup(false);
                }}
                onClose={() => setShowLocationPopup(false)}
              />
            )}

          </CardContent>
          <CardFooter className="flex flex-col">
            <button type="submit" className="w-full bg-green-300 py-2 round">Sign Up</button>
            <StrapiErrors error={formState?.strapiErrors} />
          </CardFooter>
        </Card>

        <div className="mt-4 text-center text-sm">
          Have an account?
          <Link className="underline ml-2" href="login">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  )
}

"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { useState } from "react";
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
  const [alamatOption, setAlamatOption] = useState('manual');
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
              <Input id="password" name="password" type="password" placeholder="password" />
              <ZodErrors error={formState?.zodErrors?.password} />
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

            {/* Pilihan Alamat */}
            <div className="space-y-2">
              <Label>Metode Pengisian Alamat</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="alamat_option"
                    value="manual"
                    checked={alamatOption === 'manual'}
                    onChange={() => setAlamatOption('manual')}
                  />
                  Isi Manual
                </label>
                <label className="flex items-center gap-2">
                  <input
                      type="radio"
                      name="alamat_option"
                      value="maps"
                      checked={alamatOption === 'maps'}
                      onChange={() => {
                        setAlamatOption('maps');
                        setShowLocationPopup(true);
                      }}
                    />
                    Gunakan Lokasi Maps
                </label>
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

            {/* Alamat */}
            <div className="space-y-2">
              <Label htmlFor="alamat_pengiriman">Alamat Pengiriman</Label>
              <Input
                id="alamat_pengiriman"
                name="alamat_pengiriman"
                type="text"
                placeholder="Alamat Pengiriman"
                value={alamatOption === 'maps' ? alamatFromMaps : undefined}
                readOnly={alamatOption === 'maps'}
                required
              />
            </div>

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

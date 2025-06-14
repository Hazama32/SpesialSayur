'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ identifier: "", password: "" })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await login(form)
    if (result.jwt) {
      localStorage.setItem("token", result.jwt)
      router.push("/")
    } else {
      alert("Login gagal!")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Login</h2>
      <input className="input text-black" placeholder="Email / Username" value={form.identifier}
        onChange={e => setForm({ ...form, identifier: e.target.value })} />
      <input className="input text-black" placeholder="Password" type="password" value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit" className="btn">Login</button>
    </form>
  )
}

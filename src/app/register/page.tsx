'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { register } from "@/lib/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: "", email: "", password: "" })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await register(form)
    if (result.jwt) {
      localStorage.setItem("token", result.jwt)
      router.push("/")
    } else {
      alert("Register gagal!")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Register</h2>
      <input className="input text-black" placeholder="Username" value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })} />
      <input className="input text-black" placeholder="Email" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })} />
      <input className="input text-black" placeholder="Password" type="password" value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit" className="btn">Register</button>
    </form>
  )
}

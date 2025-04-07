'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../../components/navbar";

export default function InputPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //TODO: Implement API call to add transaction to database

    router.push("/dashboard");
  };

  return (
    <>
        <Navbar active="Transaction"></Navbar>
        <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold text-center">Add Transaction</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 my-2 border rounded"/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 my-2 border rounded"/>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
        </form>
    </>
  );
}

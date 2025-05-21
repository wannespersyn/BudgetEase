'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthenticationService from "../../../../services/AuthenticationService"

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    //TODO: Call theazure function to register the user 
    

    console.log("Registering with:", name, email, password);
    router.push("/login");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold text-center">Register</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 my-2 border rounded"/>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 my-2 border rounded"/>
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 my-2 border rounded"/>
      <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Register</button>
    </form>
  );
}

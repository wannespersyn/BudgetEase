'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../../components/navbar";

export default function DashboardPage() {
  const router = useRouter();


  return (
    <>
        <Navbar active={"Dashboard"} />
        <section>
        
        </section>
    </>
  );
}

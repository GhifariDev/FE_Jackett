import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "../components/fragments/HeroSection";
import ProductList from "../components/fragments/ProductsList";
import Services from "../components/fragments/Service";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkUserStatus() {
      try {
        const res = await fetch("http://localhost:3001/api/users/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();

        if (data.isBlocked) {
          // Kalau diblokir langsung redirect ke login
          router.push("/login?blocked=1");
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      } finally {
        setLoading(false);
      }
    }
    checkUserStatus();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <HeroSection />
      <ProductList />
      <Services />
    </>
  );
}

"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/services/auth.service";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
      toast.success("Voce saiu da conta.");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nao foi possivel sair.");
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOut />
      Sair
    </Button>
  );
}

import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

interface Props {
  children: ReactNode;
}

export default function AdminRoute({ children }: Props) {
  const user = useAuthStore((state) => state.user);

  if (!user || user.rol !== "ADMIN") {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <>{children}</>;
}

"use client";
import FormError from "@/components/form-error";
import { useCurrentRole } from "@/hooks/user-current-role";
import { UserRole } from "@prisma/client";

interface RoleGateProps {
  allowedRole: UserRole;
  children: React.ReactNode;
}

const RoleGate = ({ allowedRole, children }: RoleGateProps) => {
  const role = useCurrentRole();
  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }
  return <>{children}</>;
};

export default RoleGate;

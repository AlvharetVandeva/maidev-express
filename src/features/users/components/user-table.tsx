import { RoleBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateUserStatusAction } from "@/features/users/actions";
import type { User } from "@/features/users/types";
import { formatDate } from "@/lib/utils";

export function UserTable({ users }: { users: User[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-emerald-50/80 hover:bg-emerald-50/80">
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-bold text-slate-900">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone ?? "-"}</TableCell>
              <TableCell>
                <RoleBadge role={user.role} />
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    user.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }
                >
                  {user.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell>
                <form action={updateUserStatusAction.bind(null, user.id, !user.isActive)}>
                  <Button variant="outline" size="sm" type="submit">
                    {user.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

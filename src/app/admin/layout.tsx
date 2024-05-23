import { Nav, NavLink } from "@/src/components/Nav";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">customers</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
      </Nav>

      {children}
    </>
  );
}

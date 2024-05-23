import { Nav, NavLink } from "@/src/components/Nav";

// Força a nao ter nenhum tipo de cache na pagina
export const dynamic = "force-dynamic";

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

      <div className="container my-6">{children}</div>
    </>
  );
}

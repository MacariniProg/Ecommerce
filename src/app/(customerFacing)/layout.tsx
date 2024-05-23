import { Nav, NavLink } from "@/src/components/nav";

// Força a nao ter nenhum tipo de cache na pagina
export const dynamic = "force-dynamic";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/">Homer</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">My Orders</NavLink>
      </Nav>

      <div className="container my-6">{children}</div>
    </>
  );
}

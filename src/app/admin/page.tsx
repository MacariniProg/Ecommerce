import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import db from "@/src/db/db";
import { formatCurrency, formatNumber } from "@/src/lib/formatters";

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  };
}

async function getUsersData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  };
}

async function getProjectsData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return {
    activeCount,
    inactiveCount,
  };
}

export default async function AdminDashboard() {
  const [salesData, usersData, productsData] = await Promise.all([
    getSalesData(),
    getUsersData(),
    getProjectsData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
      <DashbordCard
        title="Sales"
        subtitle={formatNumber(salesData.numberOfSales) + " Orders"}
        body={formatCurrency(salesData.amount)}
      />
      <DashbordCard
        title="Customers"
        subtitle={`${formatCurrency(
          usersData.averageValuePerUser
        )} Average Order Value`}
        body={formatNumber(usersData.userCount) + " Customers"}
      />
      <DashbordCard
        title="Actives Projects"
        subtitle={
          formatNumber(productsData.inactiveCount) + " Inactive Projects"
        }
        body={formatNumber(productsData.activeCount) + " Active Projects"}
      />
    </div>
  );
}

type DashbordCardProps = {
  title: string;
  subtitle: string;
  body: React.ReactNode;
};

function DashbordCard({ title, subtitle, body }: DashbordCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>

      <CardContent>{body}</CardContent>
    </Card>
  );
}

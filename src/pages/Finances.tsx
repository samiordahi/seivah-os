import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsTable } from "@/components/finances/TransactionsTable";

const Finances = () => {
  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Finanças</h1>
            <p className="text-muted-foreground">
              Gerencie suas transações pessoais e profissionais
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionsTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Finances;
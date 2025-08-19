import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FinancialDashboard } from "@/components/finances/FinancialDashboard";
import { TransactionTable } from "@/components/finances/TransactionTable";
import { CategoryManager } from "@/components/finances/CategoryManager";

type ContextFilter = 'all' | 'pessoal' | 'profissional';

const Finances = () => {
  const [contextFilter, setContextFilter] = useState<ContextFilter>('all');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Context Filter */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Finanças</h1>
            <p className="text-muted-foreground">Gerencie suas finanças pessoais e profissionais</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={contextFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setContextFilter('all')}
            >
              Todas
            </Button>
            <Button
              variant={contextFilter === 'pessoal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setContextFilter('pessoal')}
            >
              PF (Pessoal)
            </Button>
            <Button
              variant={contextFilter === 'profissional' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setContextFilter('profissional')}
            >
              PJ (Profissional)
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <FinancialDashboard contextFilter={contextFilter} />
          </TabsContent>
          
          <TabsContent value="cashflow" className="space-y-4">
            <TransactionTable contextFilter={contextFilter} />
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-4">
            <CategoryManager />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Finances;
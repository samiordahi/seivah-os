import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { useTransactions } from "@/hooks/useTransactions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Search } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TransactionTableProps {
  contextFilter: 'all' | 'pessoal' | 'profissional';
}

export function TransactionTable({ contextFilter }: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    category: "",
    type: "",
    status: "",
  });

  const { data: transactions, isLoading } = useTransactions({
    context: contextFilter === 'all' ? undefined : contextFilter,
    search: searchTerm,
    ...filters,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  if (isLoading) {
    return <div>Carregando transações...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-6 bg-card/90 backdrop-blur-sm border-0 shadow-lg">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <TransactionFilters filters={filters} onFiltersChange={setFilters} />
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="bg-card/90 backdrop-blur-sm border-0 shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Extrato de Transações</h3>
            <div className="text-sm text-muted-foreground">
              {transactions?.length || 0} transações
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contexto</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-muted rounded text-xs">
                        {transaction.category || 'Sem categoria'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        transaction.type === 'receita' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${
                        transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'receita' ? '+' : '-'}{formatCurrency(Math.abs(Number(transaction.amount)))}
                      </span>
                    </TableCell>
                    <TableCell>
                      <TransactionStatusBadge status={transaction.status} />
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-coral-secondary/20 text-coral-primary rounded text-xs">
                        {transaction.context === 'pessoal' ? 'PF' : 'PJ'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
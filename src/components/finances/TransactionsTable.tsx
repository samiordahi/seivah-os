import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string | null;
  type: string;
  date: string;
  status: string;
  context: string;
  created_at: string;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "pago":
      return "default";
    case "pendente":
      return "secondary";
    case "vencido":
      return "destructive";
    default:
      return "secondary";
  }
};

const getContextBadgeVariant = (context: string) => {
  return context === "pessoal" ? "outline" : "secondary";
};

const getTypeColor = (type: string) => {
  return type === "receita" ? "text-green-600" : "text-red-600";
};

export function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false });

        if (error) {
          console.error("Erro ao buscar transações:", error);
          return;
        }

        setTransactions(data || []);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  if (loading) {
    return <div className="text-center py-8">Carregando transações...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma transação encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {format(new Date(transaction.date), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell className="font-medium">
                {transaction.description}
              </TableCell>
              <TableCell>
                {transaction.category || "Sem categoria"}
              </TableCell>
              <TableCell>
                <span className={getTypeColor(transaction.type)}>
                  {transaction.type === "receita" ? "Receita" : "Despesa"}
                </span>
              </TableCell>
              <TableCell className={getTypeColor(transaction.type)}>
                {transaction.type === "receita" ? "+" : "-"}
                {formatCurrency(Math.abs(transaction.amount))}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(transaction.status)}>
                  {transaction.status.charAt(0).toUpperCase() +
                    transaction.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getContextBadgeVariant(transaction.context)}>
                  {transaction.context === "pessoal" ? "PF" : "PJ"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
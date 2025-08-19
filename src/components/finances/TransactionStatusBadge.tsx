import { Badge } from "@/components/ui/badge";

interface TransactionStatusBadgeProps {
  status: string;
}

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pago':
        return {
          label: 'Pago',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 hover:bg-green-100',
        };
      case 'pendente':
        return {
          label: 'Pendente',
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
        };
      case 'vencido':
        return {
          label: 'Vencido',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 hover:bg-red-100',
        };
      default:
        return {
          label: status,
          variant: 'outline' as const,
          className: '',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
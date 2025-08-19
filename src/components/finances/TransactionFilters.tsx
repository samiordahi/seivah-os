import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FiltersState {
  dateFrom: string;
  dateTo: string;
  category: string;
  type: string;
  status: string;
}

interface TransactionFiltersProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
}

export function TransactionFilters({ filters, onFiltersChange }: TransactionFiltersProps) {
  const updateFilter = (key: keyof FiltersState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      dateFrom: "",
      dateTo: "",
      category: "",
      type: "",
      status: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Data Inicial</label>
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => updateFilter('dateFrom', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Data Final</label>
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(e) => updateFilter('dateTo', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Tipo</label>
        <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="receita">Receita</SelectItem>
            <SelectItem value="despesa">Despesa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Status</label>
        <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="vencido">Vencido</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Ações</label>
        <Button
          variant="outline"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}
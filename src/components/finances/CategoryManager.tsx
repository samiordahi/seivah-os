import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCategories } from "@/hooks/useCategories";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function CategoryManager() {
  const { data: categories, isLoading, createCategory, updateCategory, deleteCategory } = useCategories();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#FF6B6B");

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCategory({
        name: newCategoryName.trim(),
        color: newCategoryColor,
      });
      
      setNewCategoryName("");
      setNewCategoryColor("#FF6B6B");
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar categoria",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a categoria "${name}"?`)) {
      try {
        await deleteCategory(id);
        toast({
          title: "Sucesso",
          description: "Categoria excluída com sucesso!",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir categoria",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return <div>Carregando categorias...</div>;
  }

  const suggestedCategories = [
    { name: "Marketing", color: "#FF6B6B" },
    { name: "Equipamento", color: "#4ECDC4" },
    { name: "Transporte", color: "#45B7D1" },
    { name: "Alimentação", color: "#96CEB4" },
    { name: "Educação", color: "#FFEAA7" },
    { name: "Saúde", color: "#DDA0DD" },
    { name: "Moradia", color: "#98D8C8" },
    { name: "Entretenimento", color: "#F7DC6F" },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <Card className="p-6 bg-card/90 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Gerenciar Categorias</h3>
            <p className="text-muted-foreground">Organize suas transações por categorias</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Categoria</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Nome da Categoria</label>
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Digite o nome da categoria"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Cor</label>
                  <Input
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="mt-1 h-10"
                  />
                </div>
                <Button onClick={handleCreateCategory} className="w-full">
                  Criar Categoria
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Existing Categories */}
      <Card className="p-6 bg-card/90 backdrop-blur-sm border-0 shadow-lg">
        <h4 className="text-md font-semibold text-foreground mb-4">Suas Categorias</h4>
        
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <p className="font-medium text-foreground">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Criado em {new Date(category.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma categoria criada ainda</p>
            <p className="text-sm text-muted-foreground">Crie sua primeira categoria para organizar suas transações</p>
          </div>
        )}
      </Card>

      {/* Suggested Categories */}
      <Card className="p-6 bg-card/90 backdrop-blur-sm border-0 shadow-lg">
        <h4 className="text-md font-semibold text-foreground mb-4">Categorias Sugeridas</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {suggestedCategories.map((category, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start gap-2 h-10"
              onClick={() => {
                setNewCategoryName(category.name);
                setNewCategoryColor(category.color);
                setIsCreateDialogOpen(true);
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}

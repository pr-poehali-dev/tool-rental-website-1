
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Plus,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useApiList, useApi } from "@/hooks/useApi";
import { Tool, toolsApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ProductsTableWithApi = () => {
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const { toast } = useToast();

  const {
    items: tools,
    isLoading,
    error,
    refresh,
    loadItems,
  } = useApiList<Tool>(toolsApi.getAll);

  const {
    execute: executeDelete,
    isLoading: isDeleting,
  } = useApi(toolsApi.delete, {
    showSuccessToast: true,
    showErrorToast: true,
  });

  const {
    execute: executeToggle,
    isLoading: isToggling,
  } = useApi(
    async (id: number, available: boolean) => {
      return await toolsApi.toggleAvailability(id, available);
    },
    { showSuccessToast: true }
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleSearch = () => {
    // В реальном приложении здесь был бы запрос к API с параметром поиска
    // Для демонстрации фильтруем локально
    loadItems(1, 10, { search });
  };

  const handleEdit = (tool: Tool) => {
    toast({
      title: "Редактирование",
      description: `Открыто редактирование инструмента: ${tool.name}`,
    });
  };

  const handleToggleAvailability = async (tool: Tool) => {
    try {
      await executeToggle(tool.id, !tool.available);
      refresh();
      
      toast({
        title: "Статус изменен",
        description: `Инструмент ${tool.name} теперь ${!tool.available ? 'доступен' : 'недоступен'}`,
      });
    } catch (error) {
      // Ошибка уже обрабатывается в хуке useApi
    }
  };

  const confirmDelete = async () => {
    if (!selectedTool) return;
    
    try {
      await executeDelete(selectedTool.id);
      refresh();
      setDeleteDialogOpen(false);
      
      toast({
        title: "Удалено",
        description: `Инструмент ${selectedTool.name} успешно удален`,
      });
    } catch (error) {
      // Ошибка уже обрабатывается в хуке useApi
    }
  };

  const handleAddProduct = () => {
    toast({
      title: "Новый инструмент",
      description: "Открыта форма добавления нового инструмента",
    });
  };

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.category.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase())
  );

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Ошибка загрузки данных</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md">
              {error.message || "Произошла ошибка при загрузке инструментов. Пожалуйста, попробуйте позже."}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={refresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Повторить
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Инструменты</CardTitle>
          <Button onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Поиск инструмента..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button variant="outline" onClick={handleSearch}>
              Найти
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={refresh}
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Фото</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Цена/день</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="mt-2 text-sm text-gray-500">Загрузка инструментов...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredTools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <p className="text-sm text-gray-500">Инструменты не найдены</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTools.map((tool) => (
                    <TableRow key={tool.id}>
                      <TableCell className="font-medium">{tool.id}</TableCell>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-gray-100 overflow-hidden">
                          <img
                            src={tool.image}
                            alt={tool.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate font-medium">{tool.name}</div>
                        <div className="truncate text-xs text-gray-500">
                          {tool.description}
                        </div>
                      </TableCell>
                      <TableCell>{tool.category}</TableCell>
                      <TableCell>{tool.pricePerDay} ₽</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleAvailability(tool)}
                          disabled={isToggling}
                          className="p-0 h-auto font-normal"
                        >
                          <Badge
                            variant={tool.available ? "default" : "destructive"}
                          >
                            {tool.available ? "Доступен" : "Недоступен"}
                          </Badge>
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(tool)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedTool(tool);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить инструмент</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить инструмент "{selectedTool?.name}"? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Удаление...
                </>
              ) : (
                "Удалить"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductsTableWithApi;

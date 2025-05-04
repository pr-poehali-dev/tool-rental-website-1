
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  PlusCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  Loader2,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tool, toolsApi } from "@/lib/api";
import { useApi, useApiList } from "@/hooks/useApi";
import ToolForm from "./ToolForm";

const ToolsManagement = () => {
  const [search, setSearch] = useState("");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { toast } = useToast();
  
  const {
    items: tools,
    isLoading,
    error,
    refresh,
    loadItems,
  } = useApiList<Tool>(toolsApi.getAll);
  
  const {
    execute: toggleAvailability,
    isLoading: isTogglingAvailability,
    error: toggleError,
  } = useApi(
    (id: number, available: boolean) => toolsApi.toggleAvailability(id, available),
    { showSuccessToast: true }
  );
  
  const {
    execute: deleteTool,
    isLoading: isDeleting,
  } = useApi(
    (id: number) => toolsApi.delete(id),
    { showSuccessToast: true }
  );
  
  useEffect(() => {
    loadItems();
  }, [loadItems]);
  
  // Фильтрация инструментов по поисковому запросу
  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.category.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase())
  );
  
  // Открытие диалога редактирования инструмента
  const handleEditTool = (tool: Tool) => {
    setSelectedTool(tool);
    setIsEditDialogOpen(true);
  };
  
  // Открытие диалога удаления инструмента
  const handleDeleteClick = (tool: Tool) => {
    setSelectedTool(tool);
    setIsDeleteDialogOpen(true);
  };
  
  // Подтверждение удаления инструмента
  const handleConfirmDelete = async () => {
    if (!selectedTool) return;
    
    try {
      await deleteTool(selectedTool.id);
      setIsDeleteDialogOpen(false);
      refresh();
    } catch (error) {
      // Ошибка уже обрабатывается в хуке useApi
    }
  };
  
  // Изменение доступности инструмента
  const handleToggleAvailability = async (id: number, available: boolean) => {
    try {
      await toggleAvailability(id, !available);
      refresh();
    } catch (error) {
      // Ошибка уже обрабатывается в хуке useApi
    }
  };
  
  // Обработка после успешного добавления или редактирования
  const handleFormSuccess = (tool: Tool) => {
    refresh();
    
    if (isAddDialogOpen) {
      setIsAddDialogOpen(false);
      toast({
        title: "Инструмент добавлен",
        description: `Инструмент "${tool.name}" успешно добавлен в каталог.`,
      });
    } else if (isEditDialogOpen) {
      setIsEditDialogOpen(false);
      toast({
        title: "Инструмент обновлен",
        description: `Данные инструмента "${tool.name}" успешно обновлены.`,
      });
    }
  };
  
  // Отображение ошибки при загрузке списка инструментов
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4">
              <XCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Ошибка загрузки данных</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md">
              {error.message || "Произошла ошибка при загрузке списка инструментов. Пожалуйста, попробуйте позже."}
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
          <div>
            <CardTitle>Каталог инструментов</CardTitle>
            <CardDescription>
              Управление списком инструментов для аренды
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Добавить инструмент
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Поиск инструментов..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={refresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Изображение</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Цена в день</TableHead>
                  <TableHead>Доступность</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="mt-2 text-sm text-gray-500">
                        Загрузка инструментов...
                      </p>
                    </TableCell>
                  </TableRow>
                ) : filteredTools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <p className="text-sm text-gray-500">
                        {search
                          ? "Инструменты не найдены по вашему запросу"
                          : "Инструменты отсутствуют в каталоге"}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTools.map((tool) => (
                    <TableRow key={tool.id}>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-gray-100 overflow-hidden">
                          {tool.image ? (
                            <img
                              src={tool.image}
                              alt={tool.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              <span className="text-xs">Нет фото</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {tool.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tool.category}</Badge>
                      </TableCell>
                      <TableCell>{tool.pricePerDay} ₽</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={tool.available}
                            onCheckedChange={() =>
                              handleToggleAvailability(tool.id, tool.available)
                            }
                            disabled={isTogglingAvailability}
                          />
                          <span
                            className={
                              tool.available
                                ? "text-green-600 text-sm"
                                : "text-gray-500 text-sm"
                            }
                          >
                            {tool.available ? "Доступен" : "Недоступен"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditTool(tool)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteClick(tool)}
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
      
      {/* Диалог добавления инструмента */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Добавление нового инструмента</DialogTitle>
            <DialogDescription>
              Заполните форму для добавления нового инструмента в каталог
            </DialogDescription>
          </DialogHeader>
          <ToolForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
      
      {/* Диалог редактирования инструмента */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Редактирование инструмента</DialogTitle>
            <DialogDescription>
              Внесите изменения в данные инструмента
            </DialogDescription>
          </DialogHeader>
          {selectedTool && (
            <ToolForm
              toolId={selectedTool.id}
              onSuccess={handleFormSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удаление инструмента</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот инструмент из каталога?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedTool && (
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden">
                  {selectedTool.image ? (
                    <img
                      src={selectedTool.image}
                      alt={selectedTool.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <span className="text-xs">Нет фото</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{selectedTool.name}</h4>
                  <p className="text-sm text-gray-500">{selectedTool.category}</p>
                </div>
              </div>
            )}
            <p className="mt-4 text-sm text-red-600">
              Это действие нельзя отменить. Данные будут удалены навсегда.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ToolsManagement;

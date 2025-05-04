
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Upload, X, CheckCircle } from "lucide-react";
import { Tool, toolsApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";

// Схема валидации данных
const toolSchema = z.object({
  name: z.string().min(3, "Название должно содержать не менее 3 символов"),
  description: z.string().min(10, "Описание должно содержать не менее 10 символов"),
  pricePerDay: z.coerce.number().positive("Цена должна быть положительным числом"),
  category: z.string().min(1, "Выберите категорию"),
  available: z.boolean().default(true),
});

type ToolFormValues = z.infer<typeof toolSchema>;

interface ToolFormProps {
  toolId?: number;
  onSuccess?: (tool: Tool) => void;
}

const CATEGORIES = [
  "Электроинструменты",
  "Садовый инструмент",
  "Строительное оборудование",
  "Измерительное оборудование",
  "Ручной инструмент",
  "Пневматический инструмент",
  "Сварочное оборудование",
  "Высотное оборудование",
  "Другое",
];

const ToolForm = ({ toolId, onSuccess }: ToolFormProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const { toast } = useToast();
  
  const form = useForm<ToolFormValues>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerDay: 0,
      category: "",
      available: true,
    },
  });
  
  const { 
    execute: createTool, 
    isLoading: isCreating
  } = useApi(toolsApi.create, { showSuccessToast: true });
  
  const { 
    execute: updateTool, 
    isLoading: isUpdating
  } = useApi(
    (data: Partial<Tool>) => toolsApi.update(toolId!, data),
    { showSuccessToast: true }
  );
  
  const isSubmitting = isCreating || isUpdating || isUploading;
  
  // Загрузка данных инструмента при редактировании
  useEffect(() => {
    const fetchToolData = async () => {
      if (!toolId) return;
      
      try {
        const toolData = await toolsApi.getById(toolId);
        // Заполняем форму данными инструмента
        form.reset({
          name: toolData.name,
          description: toolData.description,
          pricePerDay: toolData.pricePerDay,
          category: toolData.category,
          available: toolData.available,
        });
        
        // Если есть изображение, устанавливаем превью
        if (toolData.image) {
          setImagePreview(toolData.image);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить данные инструмента",
        });
      }
    };
    
    fetchToolData();
  }, [toolId, form, toast]);
  
  // Обработка выбора изображения
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Размер файла не должен превышать 5MB",
      });
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Допустимые форматы: JPEG, PNG, WebP",
      });
      return;
    }
    
    setSelectedImage(file);
    
    // Создаем URL для превью
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    setUploadSuccess(false);
  };
  
  // Удаление выбранного изображения
  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadSuccess(false);
  };
  
  // Загрузка изображения на сервер
  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage || uploadSuccess) {
      return imagePreview; // Изображение уже загружено или не выбрано
    }
    
    setIsUploading(true);
    
    try {
      // Создаем FormData для загрузки файла
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      // В реальном проекте здесь был бы запрос к API для загрузки файла
      // Для демонстрации мы просто имитируем загрузку и возвращаем URL
      
      // Имитация API-запроса
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Случайный URL изображения от Unsplash
      const imageUrl = `https://source.unsplash.com/500x500/?tool&random=${Date.now()}`;
      
      setUploadSuccess(true);
      return imageUrl;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  // Обработка отправки формы
  const onSubmit = async (data: ToolFormValues) => {
    try {
      // Загружаем изображение, если оно выбрано
      const imageUrl = await uploadImage();
      
      const toolData = {
        ...data,
        image: imageUrl || "",
      };
      
      let result;
      
      if (toolId) {
        // Обновление существующего инструмента
        result = await updateTool(toolData);
      } else {
        // Создание нового инструмента
        result = await createTool(toolData as Omit<Tool, 'id'>);
      }
      
      if (onSuccess && result) {
        onSuccess(result);
      }
      
      // Сбрасываем форму при создании нового инструмента
      if (!toolId) {
        form.reset();
        setSelectedImage(null);
        setImagePreview(null);
        setUploadSuccess(false);
      }
    } catch (error) {
      // Ошибки обрабатываются в хуках useApi
    }
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{toolId ? "Редактирование инструмента" : "Добавление нового инструмента"}</CardTitle>
        <CardDescription>
          {toolId ? "Внесите изменения в информацию об инструменте" : "Заполните форму для добавления нового инструмента в каталог"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название</FormLabel>
                      <FormControl>
                        <Input placeholder="Перфоратор Bosch GBH 2-26" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pricePerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Цена за день (₽)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="10"
                          placeholder="1000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Категория</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Доступен для аренды</FormLabel>
                        <FormDescription>
                          Инструмент будет отображаться в каталоге
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image">Изображение</Label>
                  <div className="mt-1.5 border rounded-md overflow-hidden">
                    {imagePreview ? (
                      <div className="relative aspect-square">
                        <img
                          src={imagePreview}
                          alt="Предпросмотр"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                          onClick={handleImageRemove}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {uploadSuccess && (
                          <div className="absolute bottom-2 right-2 bg-green-100 text-green-800 rounded-full p-1">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center h-40 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          Нажмите для загрузки
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          JPEG, PNG или WebP, до 5MB
                        </span>
                      </label>
                    )}
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Профессиональный перфоратор для работы с бетоном, камнем и кирпичом..."
                          className="resize-none h-[140px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isUploading ? "Загрузка изображения..." : toolId ? "Сохранение..." : "Создание..."}
                  </>
                ) : (
                  toolId ? "Сохранить изменения" : "Создать инструмент"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ToolForm;

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { defectsApi } from '../../api/defects';
import { usersApi } from '../../api/users';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';

const defectSchema = z.object({
  title: z.string().min(3, 'Название должно содержать минимум 3 символа'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
  location: z.string().min(3, 'Укажите локацию'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  assignedToId: z.string().optional(),
});

type DefectFormData = z.infer<typeof defectSchema>;

export function CreateDefect() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DefectFormData>({
    resolver: zodResolver(defectSchema),
  });

  const createMutation = useMutation({
    mutationFn: defectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defects'] });
      toast.success('Дефект создан');
      navigate('/defects');
    },
    onError: () => {
      toast.error('Ошибка при создании дефекта');
    },
  });

  const onSubmit = (data: DefectFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/defects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Создать дефект</h1>
          <p className="text-muted-foreground mt-1">Зарегистрируйте новый дефект</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о дефекте</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                placeholder="Краткое описание проблемы"
                {...register('title')}
                disabled={createMutation.isPending}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Подробное описание дефекта"
                rows={4}
                {...register('description')}
                disabled={createMutation.isPending}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Локация</Label>
              <Input
                id="location"
                placeholder="Адрес или местоположение объекта"
                {...register('location')}
                disabled={createMutation.isPending}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="priority">Приоритет</Label>
                <Select
                  onValueChange={(value: any) => setValue('priority', value as any)}
                  disabled={createMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите приоритет" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Низкий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="high">Высокий</SelectItem>
                    <SelectItem value="critical">Критический</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="text-sm text-red-500">{errors.priority.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedToId">Ответственный</Label>
                <Select
                  onValueChange={(value: string | undefined) => setValue('assignedToId', value)}
                  disabled={createMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите ответственного" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Не назначен</SelectItem>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Создать дефект
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/defects')}
                disabled={createMutation.isPending}
              >
                Отмена
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { defectsApi } from '../../api/defects';
import { usersApi } from '../../api/users';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, MapPin, User, Loader2 } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';


const priorityMap = {
  low: { label: 'Низкий', variant: 'secondary' as const },
  medium: { label: 'Средний', variant: 'default' as const },
  high: { label: 'Высокий', variant: 'destructive' as const },
  critical: { label: 'Критический', variant: 'destructive' as const },
};

export function DefectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  const { data: defect, isLoading } = useQuery({
    queryKey: ['defect', id],
    queryFn: () => defectsApi.getById(id!),
    enabled: !!id,
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { status?: 'open' | 'in_progress' | 'resolved' | 'closed'; assignedToId?: string }) =>
      defectsApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defect', id] });
      queryClient.invalidateQueries({ queryKey: ['defects'] });
      toast.success('Дефект обновлён');
    },
    onError: () => {
      toast.error('Ошибка при обновлении');
    },
  });

  const commentMutation = useMutation({
    mutationFn: () => defectsApi.addComment(id!, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defect', id] });
      setComment('');
      toast.success('Комментарий добавлен');
    },
    onError: () => {
      toast.error('Ошибка при добавлении комментария');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/defects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-10 w-64" />
        </div>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!defect) {
    return <div>Дефект не найден</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/defects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{defect.title}</h1>
            <p className="text-muted-foreground mt-1">Детали дефекта</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Описание</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{defect.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Комментарии</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {defect.comments?.length === 0 ? (
                <p className="text-muted-foreground text-sm">Комментариев пока нет</p>
              ) : (
                defect.comments?.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.author.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                    <Separator />
                  </div>
                ))
              )}

              <div className="space-y-2">
                <Textarea
                  placeholder="Добавить комментарий..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={() => commentMutation.mutate()}
                  disabled={!comment.trim() || commentMutation.isPending}
                >
                  {commentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Отправить
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Статус</div>
                <Select
                  value={defect.status}
                  onValueChange={(value: string) => updateMutation.mutate({ status: value as 'open' | 'in_progress' | 'resolved' | 'closed' })}
                  disabled={updateMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Открыт</SelectItem>
                    <SelectItem value="in_progress">В работе</SelectItem>
                    <SelectItem value="resolved">Решён</SelectItem>
                    <SelectItem value="closed">Закрыт</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Приоритет</div>
                <Badge variant={priorityMap[defect.priority].variant}>
                  {priorityMap[defect.priority].label}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Ответственный</div>
                <Select
                  value={defect.assignedToId || ''}
                  onValueChange={(value: any) => updateMutation.mutate({ assignedToId: value || undefined })}
                  disabled={updateMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Не назначен" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Не назначен</SelectItem>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{defect.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Создал: {defect.createdBy.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {new Date(defect.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

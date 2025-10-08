import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { defectsApi } from '../../api/defects';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Plus, Search } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';

const statusMap = {
  open: { label: 'Открыт', variant: 'destructive' as const },
  in_progress: { label: 'В работе', variant: 'default' as const },
  resolved: { label: 'Решён', variant: 'secondary' as const },
  closed: { label: 'Закрыт', variant: 'outline' as const },
};

const priorityMap = {
  low: { label: 'Низкий', variant: 'secondary' as const },
  medium: { label: 'Средний', variant: 'default' as const },
  high: { label: 'Высокий', variant: 'destructive' as const },
  critical: { label: 'Критический', variant: 'destructive' as const },
};

export function DefectsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const { data: defects, isLoading } = useQuery({
    queryKey: ['defects'],
    queryFn: defectsApi.getAll,
  });

  const filteredDefects = defects?.filter((defect) => {
    const matchesSearch = defect.title.toLowerCase().includes(search.toLowerCase()) ||
      defect.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || defect.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || defect.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Дефекты</h1>
          <p className="text-muted-foreground mt-1">Управление дефектами строительных объектов</p>
        </div>
        <Button onClick={() => navigate('/defects/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Создать дефект
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или описанию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="open">Открыт</SelectItem>
            <SelectItem value="in_progress">В работе</SelectItem>
            <SelectItem value="resolved">Решён</SelectItem>
            <SelectItem value="closed">Закрыт</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Приоритет" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все приоритеты</SelectItem>
            <SelectItem value="low">Низкий</SelectItem>
            <SelectItem value="medium">Средний</SelectItem>
            <SelectItem value="high">Высокий</SelectItem>
            <SelectItem value="critical">Критический</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Локация</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Приоритет</TableHead>
              <TableHead>Ответственный</TableHead>
              <TableHead>Создан</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredDefects?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Дефекты не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredDefects?.map((defect) => (
                <TableRow
                  key={defect.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/defects/${defect.id}`)}
                >
                  <TableCell className="font-medium">{defect.title}</TableCell>
                  <TableCell>{defect.location}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[defect.status].variant}>
                      {statusMap[defect.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityMap[defect.priority].variant}>
                      {priorityMap[defect.priority].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {defect.assignedTo?.name || 'Не назначен'}
                  </TableCell>
                  <TableCell>
                    {new Date(defect.createdAt).toLocaleDateString('ru-RU')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

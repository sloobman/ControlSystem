import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { FileText, Download } from 'lucide-react';

export function Reports() {
  const [reportType, setReportType] = useState<string>('');
  const [format, setFormat] = useState<string>('');

  const handleGenerateReport = () => {
    if (!reportType || !format) {
      toast.error('Выберите тип отчёта и формат');
      return;
    }
    toast.success(`Отчёт "${reportType}" в формате ${format.toUpperCase()} готовится к скачиванию`);
  };

  const reportTypes = [
    { value: 'all-defects', label: 'Все дефекты' },
    { value: 'open-defects', label: 'Открытые дефекты' },
    { value: 'resolved-defects', label: 'Решённые дефекты' },
    { value: 'by-priority', label: 'По приоритету' },
    { value: 'by-user', label: 'По ответственным' },
    { value: 'monthly', label: 'Месячный отчёт' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Отчёты</h1>
        <p className="text-muted-foreground mt-1">Генерация отчётов по дефектам</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Генерация отчётов
            </CardTitle>
            <CardDescription>
              Выберите тип отчёта и формат для экспорта
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Тип отчёта</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип отчёта" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Формат</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите формат" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel (XLSX)</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerateReport} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Сгенерировать отчёт
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Доступные отчёты</CardTitle>
            <CardDescription>Часто используемые отчёты</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Ежедневный отчёт по активным дефектам
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Отчёт по критическим дефектам
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Статистика за месяц
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Отчёт по исполнителям
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

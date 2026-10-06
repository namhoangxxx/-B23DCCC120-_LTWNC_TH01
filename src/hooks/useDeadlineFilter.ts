import { useMemo } from 'react';
import { type Deadline, type StatusFilter } from '../types/deadline';

// Helper function: Tính số ngày chênh lệch so với hôm nay
export const calculateDaysRemaining = (dueDateStr: string): { days: number; isOverdue: boolean } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dueDateStr);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    days: Math.abs(diffDays),
    isOverdue: diffDays < 0,
  };
};

// Custom Hook xử lý lọc danh sách bài tập theo trạng thái
export const useDeadlineFilter = (deadlines: Deadline[], filter: StatusFilter) => {
  const filteredDeadlines = useMemo(() => {
    return deadlines.filter((item) => {
      const { isOverdue } = calculateDaysRemaining(item.dueDate);

      if (filter === 'COMPLETED') return item.isCompleted;
      if (filter === 'PENDING') return !item.isCompleted && !isOverdue;
      if (filter === 'OVERDUE') return !item.isCompleted && isOverdue;
      return true; // Filter 'ALL'
    });
  }, [deadlines, filter]);

  return { filteredDeadlines };
};
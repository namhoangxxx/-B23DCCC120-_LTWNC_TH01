export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type StatusFilter = 'ALL' | 'PENDING' | 'OVERDUE' | 'COMPLETED';

export interface Deadline {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  priority: Priority;
  isCompleted: boolean;
}

export type CreateDeadlineDto = Omit<Deadline, 'id'>;

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export function isDeadline(obj: unknown): obj is Deadline {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'subject' in obj &&
    'title' in obj &&
    'dueDate' in obj
  );
}
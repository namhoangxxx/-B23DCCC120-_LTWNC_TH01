import { type ApiResponse, type Deadline } from '../types/deadline';

// Dữ liệu mẫu ban đầu
const mockDeadlines: Deadline[] = [
  {
    id: '1',
    subject: 'Lập trình Web',
    title: 'Xây dựng Student Deadline Tracker',
    dueDate: '2026-10-15',
    priority: 'HIGH',
    isCompleted: false,
  },
  {
    id: '2',
    subject: 'Cơ sở dữ liệu',
    title: 'Thiết kế ERD cho hệ thống quản lý kho',
    dueDate: '2026-09-30', // Hạn trong quá khứ -> Quá hạn
    priority: 'MEDIUM',
    isCompleted: false,
  },
];

// Hàm giả lập API trả về Promise có độ trễ 800ms
export const fetchDeadlinesApi = (): Promise<ApiResponse<Deadline[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: mockDeadlines,
        status: 200,
        message: 'Success',
      });
    }, 800);
  });
};
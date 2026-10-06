
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchDeadlinesApi } from '../../../api/deadlineApi';
import { type CreateDeadlineDto, type Deadline, type StatusFilter } from '../../../types/deadline';

// 1. Định nghĩa kiểu cho State của Slice này
interface DeadlineState {
  items: Deadline[];
  filter: StatusFilter;
  loading: boolean;
  error: string | null;
}

const initialState: DeadlineState = {
  items: [],
  filter: 'ALL',
  loading: false,
  error: null,
};

// 2. createAsyncThunk: Lấy danh sách bài tập từ API giả lập khi app khởi tạo
export const fetchDeadlines = createAsyncThunk<Deadline[]>(
  'deadlines/fetchDeadlines',
  async () => {
    const response = await fetchDeadlinesApi();
    return response.data;
  }
);

// 3. Slice chứa Reducers và ExtraReducers
const deadlineSlice = createSlice({
  name: 'deadlines',
  initialState,
  reducers: {
    // Thêm bài tập mới
    addDeadline: (state, action: PayloadAction<CreateDeadlineDto>) => {
      const newDeadline: Deadline = {
        ...action.payload,
        id: Date.now().toString(),
        isCompleted: false,
      };
      state.items.push(newDeadline);
    },
    // Đánh dấu hoàn thành / chưa hoàn thành
    toggleComplete: (state, action: PayloadAction<string>) => {
      const item = state.items.find((d) => d.id === action.payload);
      if (item) {
        item.isCompleted = !item.isCompleted;
      }
    },
    // Xóa bài tập
    deleteDeadline: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((d) => d.id !== action.payload);
    },
    // Đổi bộ lọc trạng thái
    setFilter: (state, action: PayloadAction<StatusFilter>) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeadlines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeadlines.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDeadlines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Có lỗi khi tải dữ liệu';
      });
  },
});

export const { addDeadline, toggleComplete, deleteDeadline, setFilter } = deadlineSlice.actions;
export default deadlineSlice.reducer;
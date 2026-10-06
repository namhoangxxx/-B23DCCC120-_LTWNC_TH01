import React, { useEffect, useState } from 'react';
import { FilterTabs } from './components/FilterTabs';
import { calculateDaysRemaining, useDeadlineFilter } from './hooks/useDeadlineFilter';
import {
  addDeadline,
  deleteDeadline,
  fetchDeadlines,
  setFilter,
  toggleComplete,
} from './store/features/deadlines/deadlineSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { type Priority, type StatusFilter } from './types/deadline';

export default function App() {
  const dispatch = useAppDispatch();
  const { items, filter, loading, error } = useAppSelector((state) => state.deadlines);
  const { filteredDeadlines } = useDeadlineFilter(items, filter);

  // Form State
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');

  useEffect(() => {
    dispatch(fetchDeadlines());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !title.trim() || !dueDate) return;

    dispatch(
      addDeadline({
        subject,
        title,
        dueDate,
        priority,
        isCompleted: false,
      })
    );

    setSubject('');
    setTitle('');
    setDueDate('');
    setPriority('MEDIUM');
  };

  // Helper render badge độ ưu tiên
  const renderPriorityBadge = (p: Priority) => {
    const config = {
      HIGH: { bg: '#fef2f2', color: '#991b1b', border: '#fecaca', label: '🔥 Cao' },
      MEDIUM: { bg: '#fffbe1', color: '#854d0e', border: '#fef08a', label: '⚡ Trung bình' },
      LOW: { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0', label: '🌱 Thấp' },
    };
    const style = config[p];
    return (
      <span
        style={{
          backgroundColor: style.bg,
          color: style.color,
          border: `1px solid ${style.border}`,
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600',
        }}
      >
        {style.label}
      </span>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#0f172a',
        padding: '40px 20px',
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Header App */}
        <header style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              backgroundColor: '#e0e7ff',
              color: '#4338ca',
              borderRadius: '12px',
              fontSize: '24px',
              marginBottom: '12px',
            }}
          >
            🎓
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0', color: '#1e293b' }}>
            Student Deadline Tracker
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>
            Quản lý và theo dõi tiến độ bài tập dành cho sinh viên
          </p>
        </header>

        {/* Form Thêm Bài Tập */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            marginBottom: '32px',
          }}
        >
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '700',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            ➕ Thêm bài tập mới
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                  Môn học
                </label>
                <input
                  placeholder="Ví dụ: Lập trình Web"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                  Hạn nộp
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                Tên bài tập / Nội dung yêu cầu
              </label>
              <input
                placeholder="Ví dụ: Xây dựng giao diện Redux Toolkit"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
              <div>
                <label style={{ marginRight: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                  Mức ưu tiên:
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <option value="LOW">🌱 Thấp</option>
                  <option value="MEDIUM">⚡ Trung bình</option>
                  <option value="HIGH">🔥 Cao</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4338ca',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(67, 56, 202, 0.2)',
                  transition: 'background-color 0.2s',
                }}
              >
                Tạo bài tập
              </button>
            </div>
          </form>
        </div>

        {/* Bộ lọc bài tập */}
        <div style={{ marginBottom: '20px' }}>
          <FilterTabs activeTab={filter} onChangeTab={(tab: StatusFilter) => dispatch(setFilter(tab))}>
            <FilterTabs.Tab value="ALL">Tất cả ({items.length})</FilterTabs.Tab>
            <FilterTabs.Tab value="PENDING">⏳ Chưa hoàn thành</FilterTabs.Tab>
            <FilterTabs.Tab value="OVERDUE">⚠️ Quá hạn</FilterTabs.Tab>
            <FilterTabs.Tab value="COMPLETED">✓ Đã hoàn thành</FilterTabs.Tab>
          </FilterTabs>
        </div>

        {/* Trạng thái Loading / Lỗi */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
            <div>Đang đồng bộ dữ liệu từ API giả lập...</div>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              borderRadius: '8px',
              border: '1px solid #fecaca',
              marginBottom: '16px',
            }}
          >
            ❌ Lỗi: {error}
          </div>
        )}

        {/* Danh sách bài tập */}
        {!loading && filteredDeadlines.length === 0 ? (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '48px 20px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              color: '#94a3b8',
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎉</div>
            <div style={{ fontSize: '15px', fontWeight: '500' }}>Không tìm thấy bài tập nào trong mục này.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredDeadlines.map((item) => {
              const { days, isOverdue } = calculateDaysRemaining(item.dueDate);

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '18px 20px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: item.isCompleted ? 0.75 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span
                        style={{
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          fontSize: '12px',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.subject}
                      </span>
                      {renderPriorityBadge(item.priority)}
                    </div>

                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: item.isCompleted ? '#64748b' : '#1e293b',
                        textDecoration: item.isCompleted ? 'line-through' : 'none',
                        marginBottom: '8px',
                      }}
                    >
                      {item.title}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
                      <span style={{ color: '#64748b' }}>📅 Hạn nộp: {item.dueDate}</span>

                      {item.isCompleted ? (
                        <span style={{ color: '#16a34a', fontWeight: '600' }}>✓ Đã hoàn thành</span>
                      ) : isOverdue ? (
                        <span style={{ color: '#dc2626', fontWeight: '700' }}>⚠️ Quá hạn {days} ngày</span>
                      ) : (
                        <span style={{ color: '#d97706', fontWeight: '600' }}>⏳ Còn {days} ngày</span>
                      )}
                    </div>
                  </div>

                  {/* Nút thao tác */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => dispatch(toggleComplete(item.id))}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: item.isCompleted ? '#f1f5f9' : '#f0fdf4',
                        color: item.isCompleted ? '#475569' : '#166534',
                        fontWeight: '600',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      {item.isCompleted ? 'Hoàn tác' : 'Hoàn thành'}
                    </button>
                    <button
                      onClick={() => dispatch(deleteDeadline(item.id))}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #fecaca',
                        backgroundColor: '#fef2f2',
                        color: '#991b1b',
                        fontWeight: '600',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
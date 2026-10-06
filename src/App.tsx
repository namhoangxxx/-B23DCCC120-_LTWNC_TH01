import React, { useEffect, useMemo, useState } from 'react';
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

  // Search & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'DATE' | 'PRIORITY'>('DATE');

  useEffect(() => {
    dispatch(fetchDeadlines());
  }, [dispatch]);

  // Thống kê số liệu Dashboard
  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter((i) => i.isCompleted).length;
    const overdue = items.filter((i) => !i.isCompleted && calculateDaysRemaining(i.dueDate).isOverdue).length;
    const pending = total - completed - overdue;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, overdue, progress };
  }, [items]);

  // Lọc theo tìm kiếm và sắp xếp
  const finalDisplayItems = useMemo(() => {
    return filteredDeadlines
      .filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'DATE') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else {
          const priorityMap: Record<Priority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return priorityMap[b.priority] - priorityMap[a.priority];
        }
      });
  }, [filteredDeadlines, searchTerm, sortBy]);

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

  const renderPriorityBadge = (p: Priority) => {
    const config = {
      HIGH: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', label: '🔥 Cao' },
      MEDIUM: { bg: '#fffbe1', color: '#d97706', border: '#fef08a', label: '⚡ Trung bình' },
      LOW: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', label: '🌱 Thấp' },
    };
    const style = config[p];
    return (
      <span
        style={{
          backgroundColor: style.bg,
          color: style.color,
          border: `1px solid ${style.border}`,
          padding: '2px 10px',
          borderRadius: '9999px',
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
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: '#0f172a',
        padding: '40px 20px',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header Section */}
        <header style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              borderRadius: '16px',
              fontSize: '28px',
              boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
              marginBottom: '16px',
            }}
          >
            📝
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.025em' }}>
            S D T 
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '16px' }}>
            Hệ thống quản lý tiến độ & hạn nộp bài tập cá nhân
          </p>
        </header>

        {/* Dashboard Analytics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>TỔNG BÀI TẬP</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginTop: '4px' }}>{stats.total}</div>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', color: '#d97706', fontWeight: '600' }}>ĐANG DIỄN RA</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#d97706', marginTop: '4px' }}>{stats.pending}</div>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: '600' }}>QUÁ HẠN</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#dc2626', marginTop: '4px' }}>{stats.overdue}</div>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>HOÀN THÀNH</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#16a34a', marginTop: '4px' }}>{stats.completed}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
            <span>Tiến độ hoàn thành bài tập</span>
            <span style={{ color: '#4f46e5' }}>{stats.progress}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${stats.progress}%`,
                height: '100%',
                backgroundColor: '#4f46e5',
                borderRadius: '9999px',
                transition: 'width 0.4s ease-in-out',
              }}
            />
          </div>
        </div>

        {/* Form Thêm Bài Tập */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            marginBottom: '28px',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
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
                    padding: '10px 14px',
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
                    padding: '10px 14px',
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
                Tên bài tập / Nội dung
              </label>
              <input
                placeholder="Ví dụ: Xây dựng Redux Store & Typed Hooks"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Mức ưu tiên:</label>
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
                  padding: '10px 24px',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
                }}
              >
                + Lưu bài tập
              </button>
            </div>
          </form>
        </div>

        {/* Control Bar: Search & Sort */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            placeholder="🔍 Tìm kiếm bài tập theo tên hoặc môn học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              backgroundColor: '#fff',
            }}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'DATE' | 'PRIORITY')}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="DATE">📅 Sắp xếp theo Hạn nộp</option>
            <option value="PRIORITY">🔥 Sắp xếp theo Mức ưu tiên</option>
          </select>
        </div>

        {/* Filter Tabs */}
        <div style={{ marginBottom: '20px' }}>
          <FilterTabs activeTab={filter} onChangeTab={(tab: StatusFilter) => dispatch(setFilter(tab))}>
            <FilterTabs.Tab value="ALL">Tất cả ({items.length})</FilterTabs.Tab>
            <FilterTabs.Tab value="PENDING">⏳ Đang diễn ra</FilterTabs.Tab>
            <FilterTabs.Tab value="OVERDUE">⚠️ Quá hạn</FilterTabs.Tab>
            <FilterTabs.Tab value="COMPLETED">✓ Đã hoàn thành</FilterTabs.Tab>
          </FilterTabs>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>⏳</div>
            <div>Đang tải dữ liệu bài tập...</div>
          </div>
        )}

        {error && (
          <div style={{ padding: '12px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '8px', marginBottom: '16px' }}>
            Lỗi: {error}
          </div>
        )}

        {/* Lista Bài Tập */}
        {!loading && finalDisplayItems.length === 0 ? (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '48px 20px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              color: '#94a3b8',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🍃</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#475569' }}>Không có bài tập nào</div>
            <div style={{ fontSize: '14px', marginTop: '4px' }}>Hãy thử đổi bộ lọc hoặc thêm bài tập mới ở trên.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {finalDisplayItems.map((item) => {
              const { days, isOverdue } = calculateDaysRemaining(item.dueDate);

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '18px 20px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: item.isCompleted ? 0.65 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span
                        style={{
                          backgroundColor: '#e0e7ff',
                          color: '#3730a3',
                          fontSize: '12px',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '6px',
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
                        color: item.isCompleted ? '#64748b' : '#0f172a',
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

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => dispatch(toggleComplete(item.id))}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: item.isCompleted ? '#f1f5f9' : '#f0fdf4',
                        color: item.isCompleted ? '#475569' : '#15803d',
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
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        backgroundColor: '#fef2f2',
                        color: '#b91c1c',
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
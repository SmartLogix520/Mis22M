// src/features/admin/layout/AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

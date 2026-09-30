import React from 'react';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ToastContainer from './components/ToastContainer';
import CommandPalette from './components/CommandPalette';
import InvoiceModal from './components/modals/InvoiceModal';
import ProductModal from './components/modals/ProductModal';
import CustomerModal from './components/modals/CustomerModal';

// Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import PosPage from './pages/PosPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import PurchasesPage from './pages/PurchasesPage';
import SuppliersPage from './pages/SuppliersPage';
import CustomersPage from './pages/CustomersPage';
import InvoicesPage from './pages/InvoicesPage';
import ReturnsPage from './pages/ReturnsPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const { isAuthenticated, currentPage } = useApp();

  if (!isAuthenticated) {
    return (
      <>
        <AuthPage />
        <ToastContainer />
      </>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'pos':
        return <PosPage />;
      case 'products':
        return <ProductsPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'purchases':
        return <PurchasesPage />;
      case 'suppliers':
        return <SuppliersPage />;
      case 'customers':
        return <CustomersPage />;
      case 'invoices':
        return <InvoicesPage />;
      case 'returns':
        return <ReturnsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'users':
        return <UsersPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main">
        <Topbar />
        <div className="content">
          {renderCurrentPage()}
        </div>
      </main>

      {/* Global Modals & Notifications */}
      <InvoiceModal />
      <ProductModal />
      <CustomerModal />
      <CommandPalette />
      <ToastContainer />
    </div>
  );
}

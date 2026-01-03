import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';

// --- COMPONENTES TEMPORALES (Borrar cuando crees las páginas reales en /pages) ---
const AlumnoLayout = () => <h1>Bienvenido Alumno (Aquí irá Sidebar y Navbar)</h1>;
const MaestroLayout = () => <h1>Bienvenido Maestro (Aquí irá Sidebar y Navbar)</h1>;
const AdminLayout = () => <h1>Bienvenido Admin (Aquí irá Sidebar y Navbar)</h1>;
// --------------------------------------------------------------------------------

// Componente para proteger rutas privadas y validar roles
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  // 1. Si no hay usuario logueado -> Login
  if (!user) return <Navigate to="/" replace />;

  // 2. Si el rol no coincide -> Login (o página de error)
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta Pública: Login */}
          <Route path="/" element={<LoginPage />} />

          {/* --- Rutas ALUMNO --- */}
          <Route 
            path="/alumno/*" 
            element={
              <ProtectedRoute allowedRoles={['alumno']}>
                <AlumnoLayout /> {/* Aquí irán las sub-rutas después */}
              </ProtectedRoute>
            } 
          />

          {/* --- Rutas MAESTRO --- */}
          <Route 
            path="/maestro/*" 
            element={
              <ProtectedRoute allowedRoles={['maestro']}>
                <MaestroLayout />
              </ProtectedRoute>
            } 
          />

          {/* --- Rutas ADMINISTRATIVO --- */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            } 
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  ShieldAlert,
  Users,
  Flag,
  FileCheck,
  AlertTriangle,
  Trash2,
  UserX,
  CheckCircle2,
  Activity,
  History,
  Lock,
} from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    currentUser,
    reports,
    adminResolveReport,
    allUsers,
    posts,
    communities,
    connections,
    adminAuditLog,
  } = useApp();

  const [adminTab, setAdminTab] = useState<'reports' | 'users' | 'stats' | 'logs'>('reports');

  // Guard: Only admins can view
  if (!isAdminOpen) return null;
  if (currentUser.role !== 'admin') {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-3">
          <Lock className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="font-bold text-sm text-neutral-900">Acceso Denegado</h2>
          <p className="text-xs text-neutral-600">
            Esta sección está reservada exclusivamente para administradores autorizados de Nexia Technologies.
          </p>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="w-full py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const pendingReports = reports.filter((r) => r.status === 'pending');
  const activeConnectionsCount = connections.filter((c) => c.status === 'accepted').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-rose-100 flex flex-col max-h-[88vh]">
        {/* Admin Header */}
        <div className="p-4 bg-gradient-to-r from-rose-900 via-neutral-900 to-violet-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm">Panel Administrativo Nexia</h2>
                <span className="bg-rose-500/30 text-rose-200 border border-rose-500/40 text-[9px] uppercase px-2 py-0.2 rounded-full font-bold">
                  Modo Admin
                </span>
              </div>
              <p className="text-[11px] text-neutral-300">
                Moderación, métricas y seguridad de la plataforma
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            aria-label="Cerrar panel de administración"
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Tabs */}
        <div className="flex border-b border-neutral-100 bg-neutral-50 p-2 gap-1 text-xs font-semibold">
          <button
            onClick={() => setAdminTab('reports')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'reports' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-neutral-600'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Denuncias</span>
            {pendingReports.length > 0 && (
              <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingReports.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('users')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'users' ? 'bg-white text-violet-700 shadow-xs font-bold' : 'text-neutral-600'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Usuarios ({allUsers.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('stats')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'stats' ? 'bg-white text-violet-700 shadow-xs font-bold' : 'text-neutral-600'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Métricas</span>
          </button>

          <button
            onClick={() => setAdminTab('logs')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'logs' ? 'bg-white text-violet-700 shadow-xs font-bold' : 'text-neutral-600'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Auditoría</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto flex-1 text-xs space-y-3">
          {/* TAB 1: REPORTS QUEUE */}
          {adminTab === 'reports' && (
            <div className="space-y-3">
              {reports.length > 0 ? (
                reports.map((rep) => (
                  <div
                    key={rep.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      rep.status === 'pending'
                        ? 'bg-rose-50/40 border-rose-200'
                        : 'bg-neutral-50 border-neutral-200 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                          {rep.reason}
                        </span>
                        <h3 className="font-bold text-neutral-900 mt-1">
                          Contra: {rep.targetAuthorName} ({rep.targetType})
                        </h3>
                        <p className="text-[11px] text-neutral-500">
                          Reportado por {rep.reporterName} • {new Date(rep.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rep.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : rep.status === 'action_taken'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {rep.status === 'pending' ? 'Pendiente' : rep.status === 'action_taken' ? 'Acción tomada' : 'Desestimado'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-neutral-200/80 mb-2">
                      <p className="text-[11px] text-neutral-700 italic">"{rep.targetPreview}"</p>
                      {rep.details && (
                        <p className="text-[11px] text-neutral-500 mt-1">
                          <strong>Nota del denunciante:</strong> {rep.details}
                        </p>
                      )}
                      {rep.actionTakenNotes && (
                        <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
                          ✓ {rep.actionTakenNotes}
                        </p>
                      )}
                    </div>

                    {rep.status === 'pending' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => adminResolveReport(rep.id, 'dismiss', 'Revisado y desestimado por moderación.')}
                          className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl font-semibold"
                        >
                          Desestimar
                        </button>
                        <button
                          onClick={() => adminResolveReport(rep.id, 'delete_content', 'Contenido retirado por violar normas de la comunidad.')}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar contenido</span>
                        </button>
                        <button
                          onClick={() => adminResolveReport(rep.id, 'suspend_user', 'Cuenta suspendida por conducta indebida reiterada.')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Suspender usuario</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-neutral-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-1" />
                  <p className="font-bold text-neutral-800">Cola de reportes limpia</p>
                  <p className="text-[11px] text-neutral-500">No hay contenido pendiente de moderación.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: USERS MANAGEMENT */}
          {adminTab === 'users' && (
            <div className="space-y-2">
              <p className="text-[11px] text-neutral-500 mb-2">
                Gestión segura de cuentas registradas (credenciales y contraseñas nunca expuestas por diseño de seguridad).
              </p>
              {allUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-neutral-900">{u.name}</span>
                        <span className="text-[10px] text-neutral-400">@{u.username}</span>
                        {u.role === 'admin' && (
                          <span className="bg-rose-100 text-rose-700 text-[9px] px-1.5 py-0.2 rounded font-bold">
                            Admin
                          </span>
                        )}
                        {u.isSuspended && (
                          <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.2 rounded font-bold">
                            Suspendido
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-500">
                        {u.email} • {u.age} años • {u.country}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-neutral-500">
                    {u.isPlusSubscriber ? 'Plan Nexia Plus' : 'Plan Estándar'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PLATFORM STATS */}
          {adminTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-violet-50 border border-violet-100 rounded-2xl text-center">
                  <span className="text-2xl font-black text-violet-900">{allUsers.length}</span>
                  <span className="text-[10px] uppercase font-bold text-violet-600 block mt-0.5">Usuarios Totales</span>
                </div>
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                  <span className="text-2xl font-black text-emerald-900">{activeConnectionsCount}</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block mt-0.5">Conexiones</span>
                </div>
                <div className="p-3.5 bg-sky-50 border border-sky-100 rounded-2xl text-center">
                  <span className="text-2xl font-black text-sky-900">{posts.length}</span>
                  <span className="text-[10px] uppercase font-bold text-sky-600 block mt-0.5">Publicaciones</span>
                </div>
                <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-center">
                  <span className="text-2xl font-black text-rose-900">{reports.length}</span>
                  <span className="text-[10px] uppercase font-bold text-rose-600 block mt-0.5">Total Reportes</span>
                </div>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
                <h3 className="font-bold text-neutral-800">Infraestructura & Cumplimiento Android</h3>
                <p className="text-[11px] text-neutral-600">
                  Base de datos modular optimizada para despliegue en Google Cloud y Google Play Store con mínimo costo de mantenimiento y escalabilidad global.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT LOG */}
          {adminTab === 'logs' && (
            <div className="space-y-2">
              <p className="text-[11px] text-neutral-500 mb-2">
                Registro inmutable de actividades administrativas y de seguridad:
              </p>
              {adminAuditLog.map((log) => (
                <div key={log.id} className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-800 font-medium">{log.action}</span>
                  <span className="text-neutral-400 font-mono text-[10px] shrink-0 ml-2">{log.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

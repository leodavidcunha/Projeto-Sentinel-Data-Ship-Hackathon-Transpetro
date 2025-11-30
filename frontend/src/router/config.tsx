import { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import LayoutPrincipal from '../components/templates/LayoutPrincipal';

const PaginaCockpit = lazy(() => import('../pages/cockpit/page'));
const PaginaIBI = lazy(() => import('../pages/ibi/page'));
const PaginaPrevisao = lazy(() => import('../pages/previsao/page'));
const PaginaCompliance = lazy(() => import('../pages/compliance/page'));
const PaginaManutencao = lazy(() => import('../pages/manutencao/page'));
const PaginaESG = lazy(() => import('../pages/esg/page'));
const PaginaAlertas = lazy(() => import('../pages/alertas/page'));
const PaginaIngestao = lazy(() => import('../pages/ingestao/page'));
const PaginaDigitalTwin = lazy(() => import('../pages/digital-twin/page'));
const DashboardExecutivo = lazy(() => import('../pages/dashboard-executivo/page'));
const DashboardEngenharia = lazy(() => import('../pages/dashboard-engenharia/page'));
const DashboardOperacional = lazy(() => import('../pages/dashboard-operacional/page'));
const AnaliseRegressao = lazy(() => import('../pages/analise-regressao/page'));
const PaginaNaoEncontrada = lazy(() => import('../pages/NotFound'));
const PaginaLogin = lazy(() => import('../pages/login/page'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <PaginaLogin />,
  },
  {
    path: '/app',
    element: <LayoutPrincipal />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/cockpit" replace />,
      },
      {
        path: 'cockpit',
        element: <PaginaCockpit />,
      },
      {
        path: 'dashboard-executivo',
        element: <DashboardExecutivo />
      },
      {
        path: 'dashboard-engenharia',
        element: <DashboardEngenharia />
      },
      {
        path: 'dashboard-operacional',
        element: <DashboardOperacional />
      },
      {
        path: 'analise-regressao',
        element: <AnaliseRegressao />
      },
      {
        path: 'ibi',
        element: <PaginaIBI />
      },
      {
        path: 'previsao',
        element: <PaginaPrevisao />
      },
      {
        path: 'compliance',
        element: <PaginaCompliance />
      },
      {
        path: 'manutencao',
        element: <PaginaManutencao />
      },
      {
        path: 'esg',
        element: <PaginaESG />
      },
      {
        path: 'alertas',
        element: <PaginaAlertas />
      },
      {
        path: 'ingestao',
        element: <PaginaIngestao />
      },
      {
        path: 'digital-twin',
        element: <PaginaDigitalTwin />
      },
      {
        path: '*',
        element: <PaginaNaoEncontrada />
      }
    ]
  }
];

export default routes;

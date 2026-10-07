import { AdminRoute } from "@/components/AdminRoute";
import { Layout } from "@/components/Layout";
import { AdvertisingPage } from "@/pages/Advertising";
import { AppointmentsPage } from "@/pages/Appointments";
import { ContactPage } from "@/pages/Contact";
import { HomePage } from "@/pages/Home";
import { ServiceDetailPage } from "@/pages/ServiceDetail";
import { ServicesPage } from "@/pages/Services";
import { VisaServicesPage } from "@/pages/VisaServices";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminBookingsPage } from "@/pages/admin/Bookings";
import { AdminDashboardPage } from "@/pages/admin/Dashboard";
import { AdminLoginPage } from "@/pages/admin/Login";
import { AdminMessagesPage } from "@/pages/admin/Messages";
import { AdminPostsPage } from "@/pages/admin/Posts";
import { AdminServicesPage } from "@/pages/admin/Services";
import { AdminVisasPage } from "@/pages/admin/Visas";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: ServicesPage,
});

const serviceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/$serviceId",
  component: ServiceDetailPage,
});

const visaServicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/visa-services",
  component: VisaServicesPage,
});

const appointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/appointments",
  validateSearch: (search: Record<string, unknown>): { service?: string } => ({
    service: typeof search.service === "string" ? search.service : undefined,
  }),
  component: AppointmentsPage,
});

const advertisingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/advertising",
  component: AdvertisingPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <AdminRoute>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AdminRoute>
  ),
});

const adminIndexRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/",
  component: AdminDashboardPage,
});

const adminServicesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/services",
  component: AdminServicesPage,
});

const adminPostsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/posts",
  component: AdminPostsPage,
});

const adminBookingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/bookings",
  component: AdminBookingsPage,
});

const adminMessagesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/messages",
  component: AdminMessagesPage,
});

const adminVisasRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/visas",
  component: AdminVisasPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  servicesRoute,
  serviceDetailRoute,
  visaServicesRoute,
  appointmentsRoute,
  advertisingRoute,
  contactRoute,
  adminLoginRoute,
  adminRoute.addChildren([
    adminIndexRoute,
    adminServicesRoute,
    adminPostsRoute,
    adminBookingsRoute,
    adminMessagesRoute,
    adminVisasRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

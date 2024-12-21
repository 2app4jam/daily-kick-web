<<<<<<< Updated upstream
import { createBrowserRouter } from "react-router-dom";
import Calendar from "./pages/calendar";
=======
// src/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { PlanProvider } from "./contexts/PlanContext";
import Main from "./pages/main";
import Plan from "./pages/plan";
import CreatePlan from "./pages/plan/create";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signup";
import FirstView from "./pages/auth/firstview";
>>>>>>> Stashed changes

// 로그인 상태 체크를 위한 Protected Route 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// PlanProvider로 감싸는 컴포넌트
const PlanWrapper = ({ children }: { children: React.ReactNode }) => {
  return <PlanProvider>{children}</PlanProvider>;
};

const router = createBrowserRouter([
    {
<<<<<<< Updated upstream
        path: '/calendar',
        element: <Calendar />
=======
        path: '/',
        element: <FirstView />
>>>>>>> Stashed changes
    },
    {
        path: '/main',
        element: <ProtectedRoute><Main /></ProtectedRoute>
    },
    {
        path: '/plan',
        element: <ProtectedRoute><Plan /></ProtectedRoute>
    },
    {
        path: '/plan/create',
        element: (
            <ProtectedRoute>
                <PlanWrapper>
                    <CreatePlan />
                </PlanWrapper>
            </ProtectedRoute>
        )
    },
    {
        path: '/calender',
        element: <ProtectedRoute><Main /></ProtectedRoute>
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/signup',
        element: <SignUp />
    }
]);

export default router;
import { createBrowserRouter } from "react-router-dom";
import Calendar from "./pages/calendar";


const router = createBrowserRouter([
    {
        path: '/calendar',
        element: <Calendar />
    },
]);

export default router;

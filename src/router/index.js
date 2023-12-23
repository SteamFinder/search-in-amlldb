import Main from "../components/main";
import Search from "../components/search";
import Database from "../components/database";
import TTMLtool from "../components/ttmltool";
import Error from "../components/error";
import App from "../App"
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter(
    [
        {
            path: '/search-in-amlldb/',
            element: <App />,
            children: [
                {
                    path: '',
                    element: <Main />
                },
                {
                    path: 'search',
                    element: <Search />
                },
                {
                    path: 'database',
                    element: <Database />
                },
                {
                    path: 'ttml-tool',
                    element: <TTMLtool />
                }
            ]
        },
        {
            path: '*',
            element: <App />,
            children: [
                {
                    path: '*',
                    element: <Error />
                }
            ]
        }
    ]
)

export default router;
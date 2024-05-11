import Main from "../components/main";
import Search from "../components/search";
import Database from "../components/database";
import TTMLtool from "../components/ttmltool";
import Error from "../components/error";
import Cookiemain from "../components/cookiemain"
import Player from "../components/player"
import Play from "../components/play"
import Test from "../components/test"
import App from "../App"
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter(
    [
        {
            path: '/search-in-amlldb',
            element: <App />,
            children: [
                {
                    path: '',
                    element: <Main />
                },
                {
                    path: '/search-in-amlldb/search',
                    element: <Search />
                },
                {
                    path: '/search-in-amlldb/database',
                    element: <Database />
                },
                {
                    path: '/search-in-amlldb/ttml-tool',
                    element: <TTMLtool />
                },
                {
                    path: '/search-in-amlldb/devs',
                    element: <Cookiemain />
                },
                {
                    path: '/search-in-amlldb/player',
                    element: <Player />
                },
                {
                    path: '/search-in-amlldb/test',
                    element: <Test />
                }
            ]
        },
        {
            path: '/search-in-amlldb/play',
            element: <Play />,
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
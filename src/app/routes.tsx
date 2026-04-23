// 1. 改变导入：换成 createHashRouter
import { createHashRouter } from "react-router"; 
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { ArtifactsPage } from "./components/ArtifactsPage";
import { ArtifactDetail } from "./components/ArtifactDetail";
import { AIChatPage } from "./components/AIChatPage";
import { GamesPage } from "./components/GamesPage";
import { PuzzleGame } from "./components/PuzzleGame";
import { GuessGame } from "./components/GuessGame";
import { MyPage } from "./components/MyPage";
import { FootprintsPage } from "./components/FootprintsPage";

// 2. 使用 createHashRouter，并且【删除】basename 配置
export const router = createHashRouter([
  {
    path: "/",
    element: <Layout />, 
    children: [
      { index: true, element: <HomePage /> },
      { path: "artifacts", element: <ArtifactsPage /> },
      { path: "artifacts/:id", element: <ArtifactDetail /> },
      { path: "chat", element: <AIChatPage /> },
      { path: "games", element: <GamesPage /> },
      { path: "games/puzzle", element: <PuzzleGame /> },
      { path: "games/guess", element: <GuessGame /> },
      { path: "footprints", element: <FootprintsPage /> },
      { path: "my", element: <MyPage /> },
    ],
  },
]);

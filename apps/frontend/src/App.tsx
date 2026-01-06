
import "./App.css";
import "./themes.css";

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Landing } from './screens/Landing';
import { Game } from './screens/Game';
import Login from './screens/Login';
import { GameAI } from './screens/GameAI';
import { Analysis } from './screens/Analysis';
import { Learn } from './screens/Learn';
import { LessonView } from './screens/LessonView';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { Loader } from './components/Loader';
import { Layout } from './layout';
import { Settings } from './screens/Settings';
import { Themes } from "./components/themes";
import { ThemesProvider } from "./context/themeContext";

function App() {
  return (
    <div className="min-h-screen bg-bgMain text-textMain">
      <RecoilRoot>
        <Suspense fallback={<Loader />}>
          <ThemesProvider>
            <AuthApp />
          </ThemesProvider>
        </Suspense>
      </RecoilRoot>
    </div>
  );
}

function AuthApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Layout><Landing /></Layout>}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/game/:gameId"
          element={<Layout><Game /></Layout>}
        />
        <Route
          path="/game/ai"
          element={<Layout><GameAI /></Layout>}
        />
        <Route
          path="/analysis"
          element={<Layout><Analysis /></Layout>}
        />
        <Route
          path="/learn"
          element={<Layout><Learn /></Layout>}
        />
        <Route
          path="/learn/:lessonId"
          element={<Layout><LessonView /></Layout>}
        />
        <Route
          path='/settings'
          element={<Layout><Settings /></Layout>}
        >
          <Route path="themes" element={<Themes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

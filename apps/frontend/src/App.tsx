import './App.css';
import './themes.css';

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
import { Themes } from './components/themes';
import { ThemesProvider } from './context/themeContext';

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

import { useRecoilValue } from 'recoil';
import { userAtom } from '@repo/store/userAtom';
import { Navigate, useLocation } from 'react-router-dom';

function RequireAuth({ children }: { children: JSX.Element }) {
  const user = useRecoilValue(userAtom);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AuthApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout>
                <Landing />
              </Layout>
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/game/:gameId"
          element={
            <RequireAuth>
              <Layout>
                <Game />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/game/ai"
          element={
            <RequireAuth>
              <Layout>
                <GameAI />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/analysis"
          element={
            <RequireAuth>
              <Layout>
                <Analysis />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/learn"
          element={
            <RequireAuth>
              <Layout>
                <Learn />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/learn/:lessonId"
          element={
            <RequireAuth>
              <Layout>
                <LessonView />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Layout>
                <Settings />
              </Layout>
            </RequireAuth>
          }
        >
          <Route path="themes" element={<Themes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

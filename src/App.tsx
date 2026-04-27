import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DealListPage } from '@/pages/DealListPage'
import { DealRoomPage } from '@/pages/DealRoomPage'
import { SplitViewPage } from '@/pages/SplitViewPage'
import { WIPPage } from '@/pages/WIPPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* / → /deals */}
        <Route index element={<Navigate to="/deals" replace />} />

        {/* Live pages */}
        <Route path="deals" element={<DealListPage />} />
        <Route path="deals/:id" element={<DealRoomPage />} />
        <Route path="deals/:id/conversation" element={<SplitViewPage />} />
        {/* Victory redirects back to deal room (removed confetti screen) */}
        <Route path="deals/:id/victory" element={<Navigate to="/deals" replace />} />

        {/* Placeholder nav routes */}
        <Route path="pipeline"   element={<WIPPage />} />
        <Route path="contacts"   element={<WIPPage />} />
        <Route path="companies"  element={<WIPPage />} />
        <Route path="inbox"      element={<WIPPage />} />
        <Route path="activities" element={<WIPPage />} />
        <Route path="reports"    element={<WIPPage />} />

        {/* Catch-all */}
        <Route path="*" element={<WIPPage />} />
      </Route>
    </Routes>
  )
}

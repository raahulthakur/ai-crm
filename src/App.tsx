import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DealListPage } from '@/pages/DealListPage'
import { DealRoomPage } from '@/pages/DealRoomPage'
import { SplitViewPage } from '@/pages/SplitViewPage'
import { VictoryPage } from '@/pages/VictoryPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/deals" replace />} />
        <Route path="deals" element={<DealListPage />} />
        <Route path="deals/:id" element={<DealRoomPage />} />
        <Route path="deals/:id/conversation" element={<SplitViewPage />} />
        <Route path="deals/:id/victory" element={<VictoryPage />} />
      </Route>
    </Routes>
  )
}

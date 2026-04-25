import { ReactFlow, Background, Controls, type Node, type Edge, Position } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { DealContact } from '@/types'
import { ContactNode } from './ContactNode'

const nodeTypes = { contact: ContactNode }

// CEO at top; CFO left branch, IT Security right branch (both report to CEO);
// VP Marketing under CFO; Team Lead under VP Marketing
const LAYER_X: Record<string, number> = { c001: 220, c002: 80,  c003: 80,  c004: 80,  c005: 370 }
const LAYER_Y: Record<string, number> = { c001: 0,   c002: 140, c003: 280, c004: 420, c005: 140 }

function buildNodesAndEdges(dealContacts: DealContact[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = dealContacts.map((dc) => ({
    id: dc.id,
    type: 'contact',
    position: { x: LAYER_X[dc.contact_id] ?? 220, y: LAYER_Y[dc.contact_id] ?? 0 },
    data: { dealContact: dc },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  }))

  const edges: Edge[] = dealContacts
    .filter((dc) => dc.reports_to)
    .map((dc) => ({
      id: `e-${dc.reports_to}-${dc.id}`,
      source: dc.reports_to!,
      target: dc.id,
      type: 'smoothstep',
      style: { stroke: '#d1d5db', strokeWidth: 1.5 },
      animated: false,
    }))

  return { nodes, edges }
}

interface Props {
  dealContacts: DealContact[]
}

export function OrgChartCanvas({ dealContacts }: Props) {
  const { nodes, edges } = buildNodesAndEdges(dealContacts)

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag
        zoomOnScroll
        elementsSelectable={false}
      >
        <Background color="#f1f5f9" gap={20} />
        <Controls showInteractive={false} className="!shadow-none !border !border-gray-200 !rounded-lg" />
        <div className="absolute bottom-10 left-3 z-10 rounded-lg border border-gray-200 bg-white p-2 text-xs shadow-sm">
          <p className="mb-1.5 font-medium text-gray-700">Legend</p>
          {[
            { color: 'bg-green-500', label: 'Champion' },
            { color: 'bg-red-500', label: 'Blocker' },
            { color: 'bg-gray-400', label: 'Not Contacted' },
            { color: 'bg-blue-400', label: 'Neutral' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 mb-1">
              <span className={`h-2 w-2 rounded-full ${color}`} />
              <span className="text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </ReactFlow>
    </div>
  )
}

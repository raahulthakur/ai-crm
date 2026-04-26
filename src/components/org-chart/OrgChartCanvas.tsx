import { ReactFlow, Background, BackgroundVariant, Controls, type Node, type Edge, Position, Panel } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { DealContact } from '@/types'
import { ContactNode } from './ContactNode'

const nodeTypes = { contact: ContactNode }

const LAYER_X: Record<string, number> = { c001: 220, c002: 80, c003: 80, c004: 80, c005: 370 }
const LAYER_Y: Record<string, number> = { c001: 0, c002: 140, c003: 280, c004: 420, c005: 140 }

function buildNodesAndEdges(dealContacts: DealContact[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = dealContacts.map((dc) => ({
    id: dc.id, type: 'contact',
    position: { x: LAYER_X[dc.contact_id] ?? 220, y: LAYER_Y[dc.contact_id] ?? 0 },
    data: { dealContact: dc },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  }))
  const edges: Edge[] = dealContacts.filter((dc) => dc.reports_to).map((dc) => ({
    id: `e-${dc.reports_to}-${dc.id}`,
    source: dc.reports_to!,
    target: dc.id,
    type: 'smoothstep',
    style: { stroke: '#1E4D56', strokeWidth: 1.5 },
  }))
  return { nodes, edges }
}

export function OrgChartCanvas({ dealContacts }: { dealContacts: DealContact[] }) {
  const { nodes, edges } = buildNodesAndEdges(dealContacts)
  return (
    <div className="h-full w-full">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}
        fitView fitViewOptions={{ padding: 0.3 }}
        nodesDraggable={false} nodesConnectable={false}
        panOnDrag zoomOnScroll elementsSelectable={false}>
        <Background variant={BackgroundVariant.Dots} color="#1E4D56" gap={18} size={1} />
        <Controls showInteractive={false}
          className="!border-zinc-700 !bg-zinc-900 !rounded-xl !shadow-none [&_button]:!border-zinc-700 [&_button]:!bg-zinc-900 [&_button:hover]:!bg-zinc-800" />

        {/* Legend — horizontal along the bottom (x-axis style) */}
        <Panel position="bottom-center">
          <div className="flex items-center gap-4 rounded-xl border border-zinc-700/50 bg-zinc-900/90 px-4 py-2 text-[10px] shadow-xl backdrop-blur-sm">
            {[
              { dot: 'bg-emerald-400', label: 'Champion' },
              { dot: 'bg-rose-400',    label: 'Blocked' },
              { dot: 'bg-zinc-600',    label: 'Not Contacted' },
              { dot: 'bg-blue-400',    label: 'Neutral' },
            ].map(({ dot, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full shrink-0 ${dot}`} />
                <span className="text-zinc-500 whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

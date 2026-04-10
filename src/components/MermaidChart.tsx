import React, { useEffect, useRef, useId } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#2a2d3e',
    primaryTextColor: '#d4d4e0',
    primaryBorderColor: '#6366f1',
    lineColor: '#6366f1',
    secondaryColor: '#1a1d2e',
    tertiaryColor: '#111827',
    fontFamily: '-apple-system, "Segoe UI", "PingFang SC", sans-serif',
    fontSize: '14px',
  },
  flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
  sequence: { useMaxWidth: true, actorMargin: 60, messageMargin: 40, mirrorActors: false },
})

interface Props {
  chart: string
}

const MermaidChart: React.FC<Props> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null)
  const idBase = useId().replace(/:/g, '')

  useEffect(() => {
    let cancelled = false
    const render = async () => {
      if (!ref.current) return
      try {
        const id = `m-${idBase}-${Date.now()}`
        const { svg } = await mermaid.render(id, chart.trim())
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
        }
      } catch {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = '<p style="color:#ef4444">Mermaid 渲染失败</p>'
        }
      }
    }
    render()
    return () => { cancelled = true }
  }, [chart, idBase])

  return <div ref={ref} className="mermaid-container" />
}

export default MermaidChart

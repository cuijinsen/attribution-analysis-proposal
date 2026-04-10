import React, { useEffect, useRef, useId } from 'react'

type MermaidGlobal = {
  initialize: (config: Record<string, unknown>) => void
  render: (id: string, text: string) => Promise<{ svg: string }>
}

let initialized = false

function getMermaid(): MermaidGlobal | null {
  const m = (window as Window & { mermaid?: MermaidGlobal }).mermaid
  return m ?? null
}

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
        const mermaid = getMermaid()
        if (!mermaid) {
          throw new Error('Mermaid script is not loaded')
        }

        if (!initialized) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'loose',
            suppressErrorRendering: true,
            theme: 'base',
            themeVariables: {
              primaryColor: '#f8fbff',
              primaryTextColor: '#0f172a',
              primaryBorderColor: '#3b5bfd',
              lineColor: '#3b5bfd',
              secondaryColor: '#eef4ff',
              tertiaryColor: '#f5f7fb',
              background: '#ffffff',
              fontFamily: '-apple-system, "Segoe UI", "PingFang SC", sans-serif',
              fontSize: '14px',
            },
            flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
            sequence: { useMaxWidth: true, actorMargin: 60, messageMargin: 40, mirrorActors: false },
          })
          initialized = true
        }

        const id = `m-${idBase}-${Date.now()}`
        const { svg } = await mermaid.render(id, chart.trim())
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
        }
      } catch (error) {
        console.error('Mermaid render error:', error)
        if (!cancelled && ref.current) {
          ref.current.innerHTML = '<p style="color:#dc2626">Mermaid 渲染失败</p>'
        }
      }
    }
    render()
    return () => { cancelled = true }
  }, [chart, idBase])

  return <div ref={ref} className="mermaid-container" />
}

export default MermaidChart

import React, { useState, useEffect, useRef } from 'react'
import { Button, Drawer, Input, Space, Typography, Badge, Popconfirm, Empty } from 'antd'
import { CommentOutlined, DeleteOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Text, Paragraph } = Typography

interface Comment {
  id: string
  excerpt: string
  comment: string
  timestamp: number
}

const STORAGE_KEY = 'proposal-comments-v1'

function load(): Comment[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') }
  catch { return [] }
}

function save(list: Comment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export const SelectionCommentWidget: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>(load)
  const [toolbar, setToolbar] = useState<{ x: number; y: number } | null>(null)
  const [pendingExcerpt, setPendingExcerpt] = useState('')
  const [commentText, setCommentText] = useState('')
  const [formVisible, setFormVisible] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const formVisibleRef = useRef(false)

  useEffect(() => {
    const onMouseUp = () => {
      setTimeout(() => {
        const sel = window.getSelection()
        const text = sel?.toString().trim() ?? ''
        if (text.length < 2) {
          if (!formVisibleRef.current) setToolbar(null)
          return
        }
        const range = sel?.getRangeAt(0)
        const rect = range?.getBoundingClientRect()
        if (!rect) return
        setToolbar({ x: rect.left + rect.width / 2, y: rect.top - 44 })
      }, 10)
    }
    document.addEventListener('mouseup', onMouseUp)
    return () => document.removeEventListener('mouseup', onMouseUp)
  }, [])

  const openForm = () => {
    const text = window.getSelection()?.toString().trim() ?? ''
    if (!text) return
    setPendingExcerpt(text.slice(0, 160))
    setCommentText('')
    formVisibleRef.current = true
    setFormVisible(true)
  }

  const closeForm = () => {
    formVisibleRef.current = false
    setFormVisible(false)
    setToolbar(null)
  }

  const submit = () => {
    if (!commentText.trim()) return
    const next: Comment[] = [...comments, {
      id: String(Date.now()),
      excerpt: pendingExcerpt,
      comment: commentText.trim(),
      timestamp: Date.now(),
    }]
    setComments(next)
    save(next)
    formVisibleRef.current = false
    setFormVisible(false)
    setToolbar(null)
  }

  const del = (id: string) => {
    const next = comments.filter(c => c.id !== id)
    setComments(next)
    save(next)
  }

  return (
    <>
      {/* 划词工具条 */}
      {toolbar && !formVisible && (
        <div
          onMouseDown={e => e.preventDefault()}
          style={{
            position: 'fixed',
            left: toolbar.x,
            top: Math.max(toolbar.y, 8),
            transform: 'translateX(-50%)',
            zIndex: 9990,
            background: '#1e293b',
            borderRadius: 8,
            padding: '4px 10px',
            boxShadow: '0 4px 16px rgba(0,0,0,.35)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button
            size="small"
            type="text"
            icon={<CommentOutlined style={{ color: '#93c5fd' }} />}
            style={{ color: '#e2e8f0', fontSize: 12, height: 26 }}
            onClick={openForm}
          >
            添加评论
          </Button>
        </div>
      )}

      {/* 评论输入框 */}
      {formVisible && toolbar && (
        <div
          style={{
            position: 'fixed',
            left: Math.min(toolbar.x, window.innerWidth - 330),
            top: Math.max(toolbar.y + 20, 8),
            zIndex: 9991,
            background: '#ffffff',
            borderRadius: 12,
            padding: 16,
            width: 310,
            boxShadow: '0 8px 32px rgba(0,0,0,.18)',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{
            background: '#fefce8',
            borderLeft: '3px solid #f59e0b',
            borderRadius: 4,
            padding: '5px 10px',
            marginBottom: 10,
            fontSize: 12,
            color: '#92400e',
            lineHeight: 1.5,
          }}>
            &ldquo;{pendingExcerpt.slice(0, 70)}{pendingExcerpt.length > 70 ? '…' : ''}&rdquo;
          </div>
          <TextArea
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="请输入评论内容…"
            autoSize={{ minRows: 2, maxRows: 5 }}
            autoFocus
            style={{ marginBottom: 10 }}
            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit() }}
          />
          <Space>
            <Button type="primary" size="small" onClick={submit}>提交</Button>
            <Button size="small" onClick={closeForm}>取消</Button>
          </Space>
          <Text style={{ display: 'block', marginTop: 8, color: '#94a3b8', fontSize: 11 }}>
            Ctrl+Enter 快速提交
          </Text>
        </div>
      )}

      {/* 悬浮按钮 */}
      <div style={{ position: 'fixed', bottom: 72, right: 24, zIndex: 9992 }}>
        <Badge count={comments.length} offset={[-4, 4]}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<CommentOutlined />}
            onClick={() => setDrawerOpen(true)}
            style={{ boxShadow: '0 4px 14px rgba(59,91,253,.45)' }}
          />
        </Badge>
      </div>

      {/* 评论列表抽屉 */}
      <Drawer
        title={`圈选评论 (${comments.length})`}
        placement="right"
        width={360}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {comments.length === 0 ? (
          <Empty
            description="还没有评论，选中正文文字即可添加"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div>
            {[...comments].reverse().map(c => (
              <div key={c.id} style={{ marginBottom: 20, borderBottom: '1px solid #f0f4f8', paddingBottom: 16 }}>
                <div style={{
                  background: '#fffbeb',
                  borderLeft: '3px solid #f59e0b',
                  borderRadius: 4,
                  padding: '5px 10px',
                  marginBottom: 8,
                  fontSize: 12,
                  color: '#92400e',
                  lineHeight: 1.5,
                }}>
                  &ldquo;{c.excerpt.slice(0, 100)}{c.excerpt.length > 100 ? '…' : ''}&rdquo;
                </div>
                <Paragraph style={{ margin: 0, fontSize: 13 }}>{c.comment}</Paragraph>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {new Date(c.timestamp).toLocaleString('zh-CN')}
                  </Text>
                  <Popconfirm
                    title="确定删除这条评论？"
                    onConfirm={() => del(c.id)}
                    okText="删除"
                    cancelText="取消"
                  >
                    <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </>
  )
}
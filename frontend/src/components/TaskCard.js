'use client'

import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Calendar, Clock, Circle } from 'lucide-react'
import { cn } from '../lib/utils'

const priorityConfig = {
  urgent: {
    className: 'priority-urgent',
    label: 'Urgent',
    icon: '🔥',
  },
  medium: {
    className: 'priority-medium',
    label: 'Medium',
    icon: '⚡',
  },
  low: {
    className: 'priority-low',
    label: 'Low',
    icon: '🌱',
  },
}

const statusConfig = {
  todo: { label: 'To Do', color: 'bg-muted' },
  'in-progress': { label: 'In Progress', color: 'bg-ai-primary' },
  completed: { label: 'Completed', color: 'bg-success' },
}

export default function TaskCard({ task, className }) {
  const priority = priorityConfig[task.priority]
  const status = statusConfig[task.status]

  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed'
  const daysUntilDeadline = Math.ceil(
    (new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Card className={cn('glass-card hover:glass-floating smooth-transition group animate-bounce-in', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Circle
              className={cn(
                'h-3 w-3 rounded-full border-2',
                task.status === 'completed' ? 'bg-success border-success' : 'border-muted-foreground'
              )}
            />
            <Badge variant="outline" className={cn('text-xs', priority.className)}>
              {priority.icon} {priority.label}
            </Badge>
          </div>
          <Badge variant="secondary" className="text-xs">
            {task.category}
          </Badge>
        </div>

        <CardTitle className="text-lg font-semibold group-hover:text-ai-primary smooth-transition">
          {task.title}
        </CardTitle>

        {task.description && (
          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(task.deadline).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span
                className={cn(
                  isOverdue
                    ? 'text-urgent'
                    : daysUntilDeadline <= 2
                    ? 'text-medium'
                    : 'text-muted-foreground'
                )}
              >
                {isOverdue ? 'Overdue' : `${daysUntilDeadline}d left`}
              </span>
            </div>
          </div>

          <Badge variant="outline" className={cn('text-xs', status.color, 'text-white')}>
            {status.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

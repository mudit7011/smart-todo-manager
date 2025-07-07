"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Calendar, Clock, Bell } from "lucide-react"
import { cn } from "../lib/utils"

const priorityConfig = {
  urgent: { color: "bg-urgent text-white", dot: "bg-urgent" },
  medium: { color: "bg-medium text-white", dot: "bg-medium" },
  low: { color: "bg-low text-white", dot: "bg-low" }
}

const typeIcons = {
  task: "📋",
  reminder: "⏰", 
  meeting: "👥"
}

const statusConfig = {
  upcoming: { color: "text-muted-foreground", bg: "bg-muted/10" },
  today: { color: "text-ai-primary", bg: "bg-ai-primary/10" },
  overdue: { color: "text-urgent", bg: "bg-urgent/10" }
}

export default function ReminderTimeline({ events }) {
  const sortedEvents = [...events].sort((a, b) => new Date(a.deadline) - new Date(b.deadline))

  const formatDate = (date) => {
    const now = new Date()
    const eventDate = new Date(date)
    const diff = eventDate.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Today"
    if (days === 1) return "Tomorrow"
    if (days === -1) return "Yesterday"
    if (days < 0) return `${Math.abs(days)} days ago`
    if (days <= 7) return `In ${days} days`

    return eventDate.toLocaleDateString()
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Card className="glass-card hover:glass-floating smooth-transition">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          📅 Reminder Timeline
          <Badge variant="outline" className="text-xs">
            {events.length} Events
          </Badge>
        </CardTitle>
        <CardDescription>
          Upcoming deadlines and reminders organized by priority
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming events</p>
              <p className="text-sm">Create your first task to see it here!</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-ai-primary via-ai-secondary to-transparent opacity-30" />
              {sortedEvents.map((event) => (
                <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                  <div className={cn(
                    "relative z-10 h-8 w-8 rounded-full border-2 border-background flex items-center justify-center text-xs",
                    priorityConfig[event.priority].dot
                  )}>
                    {typeIcons[event.type]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "p-3 rounded-lg border smooth-transition",
                      statusConfig[event.status].bg
                    )}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{event.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {event.category}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs", priorityConfig[event.priority].color)}
                            >
                              {event.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(event.deadline)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(event.deadline)}</span>
                        </div>
                        {event.status === "today" && (
                          <div className="flex items-center gap-1 text-ai-primary">
                            <Bell className="h-3 w-3" />
                            <span>Reminder sent</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
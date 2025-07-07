'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon, Plus, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const categories = [
  "Work", "Personal", "Health", "Learning", "Finance", "Family", "Travel", "Other"
]

export function AITaskCreator({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("medium")
  const [deadline, setDeadline] = useState()
  const [isAILoading, setIsAILoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !deadline) return

    onSubmit({
      title,
      description,
      category: category || "Other",
      priority,
      deadline
    })

    setTitle("")
    setDescription("")
    setCategory("")
    setPriority("medium")
    setDeadline(undefined)
    onClose()
  }

  const handleAISuggestions = async () => {
    setIsAILoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    const suggestions = [
      "Break down into smaller subtasks",
      "Set reminders 24 hours before deadline",
      "Consider dependencies with other tasks",
      "Allocate 2x the estimated time for buffer"
    ]

    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    setDescription(prev => prev + (prev ? "\n\n" : "") + `💡 AI Suggestion: ${suggestion}`)
    setIsAILoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <Card className="glass-floating w-full max-w-lg mx-4 animate-bounce-in">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold bg-ai-gradient bg-clip-text text-transparent">
                ✨ AI Task Creator
              </CardTitle>
              <CardDescription>
                Create intelligent tasks with AI assistance
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="glass-card hover:glass-floating"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="glass-card focus:glass-floating smooth-transition"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Description</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAISuggestions}
                  disabled={isAILoading}
                  className="ai-button-glow text-xs"
                >
                  {isAILoading ? "✨ Thinking..." : "✨ Get AI Suggestions"}
                </Button>
              </div>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details, context, or AI suggestions..."
                className="glass-card focus:glass-floating smooth-transition resize-none"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="glass-card focus:glass-floating smooth-transition">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value)}>
                  <SelectTrigger className="glass-card focus:glass-floating smooth-transition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="urgent">🔥 Urgent</SelectItem>
                    <SelectItem value="medium">⚡ Medium</SelectItem>
                    <SelectItem value="low">🌱 Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Deadline *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal glass-card hover:glass-floating smooth-transition",
                      !deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 glass-card" align="start">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 glass-card hover:glass-floating smooth-transition"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!title || !deadline}
                className="flex-1 ai-button"
              >
                ✨ Create Task
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

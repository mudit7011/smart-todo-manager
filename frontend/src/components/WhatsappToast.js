'use client'

import { toast } from '../hooks/use-toast'
import { Button } from '../components/ui/button'
import { Check, MessageCircle, Sparkles } from 'lucide-react'

export function showWhatsAppToast(data) {
  toast({
    title: 'WhatsApp Reminder Sent! ✅',
    description: (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-green-500" />
          <span className="font-medium">{data.taskTitle}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {data.recipientName
            ? `Sent to ${data.recipientName}`
            : 'Sent successfully'} • {data.scheduledTime.toLocaleTimeString()}
        </div>
        <div className="flex items-center gap-1 text-xs text-green-600">
          <Sparkles className="h-3 w-3" />
          <span>AI optimized timing</span>
        </div>
      </div>
    ),
    duration: 5000,
    action: (
      <Button
        variant="outline"
        size="sm"
        className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
      >
        <Check className="h-3 w-3 mr-1" />
        Got it
      </Button>
    ),
  })
}

// Hook for managing WhatsApp reminders
export function useWhatsAppReminders() {
  const sendReminder = async (taskTitle, recipientName) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const reminderData = {
      taskTitle,
      recipientName,
      scheduledTime: new Date(),
    }

    showWhatsAppToast(reminderData)
    return reminderData
  }

  const scheduleReminder = async (taskTitle, scheduledTime, recipientName) => {
    // In a real app, this would schedule the reminder
    console.log(`Scheduling WhatsApp reminder: ${taskTitle} at ${scheduledTime}`)

    toast({
      title: 'Reminder Scheduled! 📅',
      description: (
        <div className="space-y-1">
          <div className="font-medium">{taskTitle}</div>
          <div className="text-sm text-muted-foreground">
            Will be sent on {scheduledTime.toLocaleDateString()} at{' '}
            {scheduledTime.toLocaleTimeString()}
          </div>
        </div>
      ),
      duration: 3000,
    })

    return { taskTitle, scheduledTime, recipientName }
  }

  return {
    sendReminder,
    scheduleReminder,
  }
}

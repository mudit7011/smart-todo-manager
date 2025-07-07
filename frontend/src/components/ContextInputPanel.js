// File: src/components/ContextInputPanel.jsx

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "../../hooks/use-toast";

const contextTypes = [
  { value: "whatsapp", label: "\uD83D\uDCAC WhatsApp", color: "bg-green-500" },
  { value: "email", label: "\uD83D\uDCE7 Email", color: "bg-blue-500" },
  { value: "note", label: "\uD83D\uDCDD Note", color: "bg-purple-500" },
];

export function ContextInputPanel({ onContextSubmit }) {
  const [content, setContent] = useState("");
  const [type, setType] = useState("note");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onContextSubmit({ type, content: content.trim() });

    toast({
      title: "Context Added Successfully! \uD83C\uDFC2",
      description: "AI will use this context to improve task suggestions and reminders.",
      duration: 3000,
    });

    setContent("");
    setIsProcessing(false);
  };

  const placeholderText = {
    whatsapp: "Paste WhatsApp conversation or context...\ne.g., 'Meeting with client tomorrow at 3pm about project proposal'",
    email: "Paste email content or context...\ne.g., 'Quarterly review due next Friday, need to prepare presentation'",
    note: "Add any context or notes...\ne.g., 'Remember to call mom about birthday party planning'",
  };

  return (
    <Card className="glass-card hover:glass-floating smooth-transition">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          🤖 Context Input
          <Badge variant="outline" className="text-xs">
            AI Enhanced
          </Badge>
        </CardTitle>
        <CardDescription>
          Add context from WhatsApp, emails, or notes to help AI understand your priorities
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {contextTypes.map((contextType) => (
              <Badge
                key={contextType.value}
                variant={type === contextType.value ? "default" : "outline"}
                className={`cursor-pointer smooth-transition ${type === contextType.value ? contextType.color : ""}`}
                onClick={() => setType(contextType.value)}
              >
                {contextType.label}
              </Badge>
            ))}
          </div>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholderText[type]}
            className="glass-card focus:glass-floating smooth-transition min-h-[120px] resize-none"
            disabled={isProcessing}
          />

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {content.length > 0 && (
                <span>
                  {content.length} characters • AI will analyze this context
                </span>
              )}
            </div>

            <Button
              type="submit"
              disabled={!content.trim() || isProcessing}
              className="ai-button"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Processing...
                </>
              ) : (
                <>✨ Add Context</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

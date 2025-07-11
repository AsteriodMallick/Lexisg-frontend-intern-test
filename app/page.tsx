"use client"

import type { ReactElement } from "react"

import { useState } from "react"
import { Send, FileText, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Citation {
  text: string
  source: string
  link: string
  paragraph?: string
}

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  citations?: Citation[]
  timestamp: Date
}

const simulatedResponse = {
  answer:
    "Yes, under Section 166 of the Motor Vehicles Act, 1988, the claimants are entitled to an addition for future prospects even when the deceased was self-employed and aged 54–55 years at the time of the accident. In Dani Devi v. Pritam Singh, the Court held that 10% of the deceased's annual income should be added as future prospects.",
  citations: [
    {
      text: "as the age of the deceased at the time of accident was held to be about 54-55 years by the learned Tribunal, being self-employed, as such, 10% of annual income should have been awarded on account of future prospects.",
      source: "Dani_Devi_v_Pritam_Singh.pdf",
      link: "https://lexisingapore-my.sharepoint.com/:b:/g/personal/harshit_lexi_sg/EdOegeiR_gdBvQxdyW4xE6oBCDgj5E4Bo5wjvhPHpqgIuQ?e=TEu4vz",
      paragraph: "Para 7",
    },
  ],
}

export default function LexiAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: simulatedResponse.answer,
        citations: simulatedResponse.citations,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 2000)
  }

  const handleCitationClick = (citation: Citation) => {
    setSelectedCitation(citation)
    setIsPdfModalOpen(true)
    // In a real implementation, this would open the PDF and scroll to the paragraph
    window.open(citation.link, "_blank")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Lexi Legal Assistant</h1>
            <p className="text-sm text-gray-500">AI-powered legal research with citations</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">Welcome to Lexi</h2>
              <p className="text-gray-500 mb-6">
                Ask any legal question and get answers with citations from relevant case law and statutes.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-2xl mx-auto">
                <p className="text-sm text-blue-800 font-medium mb-2">Try this example:</p>
                <p className="text-sm text-blue-700">
                  "In a motor accident claim where the deceased was self-employed and aged 54–55 years at the time of
                  death, is the claimant entitled to an addition towards future prospects in computing compensation
                  under Section 166 of the Motor Vehicles Act, 1988?"
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-3xl ${message.type === "user" ? "ml-12" : "mr-12"}`}>
                <div className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {message.type === "user" ? "U" : "L"}
                  </div>

                  <div className="flex-1">
                    <div
                      className={`rounded-lg px-4 py-3 ${
                        message.type === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>

                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Citations</p>
                        {message.citations.map((citation, index) => (
                          <Card
                            key={index}
                            className="border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                            onClick={() => handleCitationClick(citation)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-700 leading-relaxed mb-2">"{citation.text}"</p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {citation.source}
                                    </Badge>
                                    {citation.paragraph && (
                                      <Badge variant="outline" className="text-xs">
                                        {citation.paragraph}
                                      </Badge>
                                    )}
                                    <ExternalLink className="w-3 h-3 text-gray-400" />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-2">{formatTime(message.timestamp)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-3xl mr-12">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                    L
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <p className="text-sm text-gray-600">Analyzing legal documents...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a legal question..."
                className="min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
            </div>
            <Button type="submit" disabled={!input.trim() || isLoading} className="px-6">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to send, Shift + Enter for new line</p>
        </div>
      </div>

      {/* PDF Modal */}
      <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {selectedCitation?.source}
              {selectedCitation?.paragraph && <Badge variant="outline">{selectedCitation.paragraph}</Badge>}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-gray-100 rounded-lg p-4">
            <div className="bg-white rounded border-2 border-dashed border-gray-300 h-full flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">PDF viewer would be embedded here</p>
                <p className="text-sm text-gray-500 mb-4">
                  In a real implementation, this would show the PDF with {selectedCitation?.paragraph} highlighted.
                </p>
                <Button
                  onClick={() => selectedCitation && window.open(selectedCitation.link, "_blank")}
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

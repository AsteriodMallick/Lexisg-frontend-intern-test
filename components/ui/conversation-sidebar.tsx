"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { MessageSquare, Plus, Trash2, LogOut, User, FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface ConversationSidebarProps {
  currentConversationId: string | null
  onConversationSelect: (conversationId: string) => void
  onNewConversation: () => void
  onSignOut: () => void
  userEmail: string
}

export function ConversationSidebar({
  currentConversationId,
  onConversationSelect,
  onNewConversation,
  onSignOut,
  userEmail,
}: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) throw error

      setConversations(data || [])
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      // Delete messages first
      await supabase.from("messages").delete().eq("conversation_id", conversationId)

      // Then delete conversation
      const { error } = await supabase.from("conversations").delete().eq("id", conversationId)

      if (error) throw error

      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))

      if (currentConversationId === conversationId) {
        onNewConversation()
      }
    } catch (error) {
      console.error("Error deleting conversation:", error)
    }
  }

  const truncateTitle = (title: string, maxLength = 30) => {
    return title.length > maxLength ? title.substring(0, maxLength) + "..." : title
  }

  return (
    <Sidebar className="w-80">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">Lexi Legal</h2>
            <p className="text-sm text-muted-foreground">AI Assistant</p>
          </div>
        </div>
        <div className="px-4">
          <Button onClick={onNewConversation} className="w-full gap-2">
            <Plus className="w-4 h-4" />
            New Conversation
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-300px)]">
              <SidebarMenu>
                {isLoading ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">Loading conversations...</div>
                ) : conversations.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No conversations yet.
                    <br />
                    Start a new conversation to get started.
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <SidebarMenuItem key={conversation.id}>
                      <SidebarMenuButton
                        onClick={() => onConversationSelect(conversation.id)}
                        isActive={currentConversationId === conversation.id}
                        className="w-full justify-between group"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <MessageSquare className="w-4 h-4 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{truncateTitle(conversation.title)}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                          onClick={(e) => deleteConversation(conversation.id, e)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-4 py-2 text-sm">
              <User className="w-4 h-4" />
              <span className="flex-1 truncate">{userEmail}</span>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onSignOut}
              className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

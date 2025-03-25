"use client"

import { useEffect, useState } from "react"
import PortalLayout from "../components/PortalLayout"

function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:8000/messaging/conversations/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch conversations")
        }

        const data = await response.json()
        setConversations(data)

        // Select the first conversation by default if available
        if (data.length > 0) {
          setSelectedConversation(data[0])
          fetchMessages(data[0].id)
        } else {
          setLoading(false)
        }
      } catch (err) {
        console.error("Error fetching conversations:", err)
        setError("Failed to load your conversations")
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  const fetchMessages = async (conversationId) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8000/messaging/conversations/${conversationId}/messages/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }

      const data = await response.json()
      setMessages(data)
    } catch (err) {
      console.error("Error fetching messages:", err)
      setError("Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation)
    fetchMessages(conversation.id)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    setSending(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:8000/messaging/conversations/${selectedConversation.id}/messages/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ content: newMessage }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const sentMessage = await response.json()
      setMessages((prev) => [...prev, sentMessage])
      setNewMessage("")
    } catch (err) {
      console.error("Error sending message:", err)
      alert("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  const startNewConversation = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8000/messaging/conversations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ recipient: "staff" }), // Assuming 'staff' is a valid recipient
      })

      if (!response.ok) {
        throw new Error("Failed to create conversation")
      }

      const newConversation = await response.json()
      setConversations((prev) => [...prev, newConversation])
      setSelectedConversation(newConversation)
      setMessages([])
    } catch (err) {
      console.error("Error creating conversation:", err)
      alert("Failed to create new conversation")
    }
  }

  return (
    <PortalLayout>
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      <div className="flex h-[calc(100vh-200px)] bg-white rounded shadow overflow-hidden">
        {/* Conversations sidebar */}
        <div className="w-1/3 border-r overflow-y-auto">
          <div className="p-4 border-b">
            <button onClick={startNewConversation} className="btn w-full">
              New Message
            </button>
          </div>

          {conversations.length > 0 ? (
            <ul>
              {conversations.map((conversation) => (
                <li
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${selectedConversation?.id === conversation.id ? "bg-gray-100" : ""}`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <p className="font-bold">{conversation.recipient.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.last_message ? conversation.last_message.content : "No messages yet"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {conversation.last_message ? new Date(conversation.last_message.created_at).toLocaleString() : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">No conversations yet</div>
          )}
        </div>

        {/* Messages area */}
        <div className="w-2/3 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Conversation header */}
              <div className="p-4 border-b">
                <h2 className="font-bold">{selectedConversation.recipient.name}</h2>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                {loading ? (
                  <p className="text-center">Loading messages...</p>
                ) : error ? (
                  <p className="text-center text-red-600">{error}</p>
                ) : messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg max-w-[80%] ${message.is_sender ? "ml-auto bg-blue-100" : "bg-gray-100"}`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(message.created_at).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No messages yet</p>
                )}
              </div>

              {/* Message input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="form-control rounded-r-none"
                    disabled={sending}
                  />
                  <button type="submit" disabled={sending || !newMessage.trim()} className="btn rounded-l-none">
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a conversation or start a new one</p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  )
}

export default MessagesPage


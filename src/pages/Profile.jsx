import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, Check, X } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/authProvider"
import api from "@/axiosInstance"

export default function ProfilePage() {
  const { user: currUser } = useAuth()
  const [user, setUser] = useState(currUser)
  const [isLoading, setIsLoading] = useState(true)
  const [editingField, setEditingField] = useState(null)
  const [editValue, setEditValue] = useState("")

  const editableFields = [
    { id: "name", label: "Name", type: "text" },
    { id: "username", label: "Username", type: "text" },
    { id: "email", label: "Email", type: "email" },
    { id: "phone", label: "Phone", type: "number" },
  ]

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // checks for token in header and decodes token
        const response = await api.get("/auth/token")
        setUser(response.data.user)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleEdit = (field, value) => {
    setEditingField(field)
    setEditValue(value)
  }

  const handleEditPass = (value = null) => {
    toast.message("Stay tuned to update your password!")
  }

  const handleCancel = () => {
    setEditingField(null)
    setEditValue("")
  }

  const handleSubmit = async (field) => {
    if (!editValue.trim()) {
      toast.error("Field cannot be empty")
      return
    }
    setIsLoading(true)
    try {
      toast.loading(`Updating ${field} to ${editValue}`)

      await api.put(`/user/${user.id}/${field}`, { [field]: editValue })

      setUser((prevUser) => ({
        ...prevUser,
        [field]: editValue,
      }))

      toast.dismiss()
      toast.success(`Your ${field} has been updated`)
    } catch (error) {
      console.error(`Error updating ${field}:`, error)
      toast.dismiss()
      toast.error(`Failed to update ${field}`)
    } finally {
      setIsLoading(false)
      setEditingField(null)
      setEditValue("")
    }
  }

  const getInitials = (name) => {
    if (!name) return "U"
    const nameParts = name.split(" ")
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()
    return nameParts[0].charAt(0).toUpperCase() + nameParts[nameParts.length - 1].charAt(0).toUpperCase()
  }

  if (isLoading && !user) {
    return <div className="flex h-screen items-center justify-center">Loading profile...</div>
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Card className="glass-dark border border-gray-700/50 shadow-lg">
        <CardHeader className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <CardTitle className="text-2xl gradient-text">Profile</CardTitle>
            <CardDescription className="text-gray-300">View and edit your personal information</CardDescription>
          </div>
          <Avatar className="h-20 w-20 border border-teal-500/30">
            <AvatarImage src={user?.avatar || ""} alt={user?.name} />
            <AvatarFallback className="text-xl bg-gray-800 text-teal-400">{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="space-y-6">
          {editableFields.map((field) => (
            <div key={field.id} className="space-y-1">
              <div className="text-gray-400 text-sm font-medium">{field.label}</div>
              <div className="flex items-center justify-between gap-4">
                {editingField === field.id ? (
                  <div className="flex-1">
                    <Input
                      type={field.type}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                      disabled={isLoading}
                      autoFocus
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>
                ) : (
                  <div className="flex-1 py-2 text-gray-300">{user?.[field.id]}</div>
                )}
                <div className="flex gap-2">
                  {editingField === field.id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleSubmit(field.id)}
                        disabled={isLoading}
                        className="px-2 bg-teal-500 hover:bg-teal-600"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="px-2 border-gray-700 hover:bg-gray-700/70 hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(field.id, user?.[field.id])}
                      disabled={isLoading}
                      className="px-2 hover:text-teal-400"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="border-b border-gray-700 pt-2"></div>
            </div>
          ))}
          <div className="pt-4">
            <Button
              variant="outline"
              onClick={() => handleEditPass()}
              className="border-gray-700 hover:bg-gray-700/70 hover:text-teal-400"
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

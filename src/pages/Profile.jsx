import React, { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Check, X, Lock } from "lucide-react";
import { toast } from "sonner";
import api from "@/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { user: currUser } = useAuth();
  const [user, setUser] = useState(currUser);
  const [isLoading, setIsLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Add state for password change dialog
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const editableFields = [
    { id: "name", label: "Name", type: "text" },
    { id: "username", label: "Username", type: "text" },
    { id: "email", label: "Email", type: "email" },
    { id: "phone", label: "Phone", type: "number" },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // checks for token in header and decodes token
        const response = await api.get("/auth/token");
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEdit = (field, value) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleEditPass = () => {
    setPasswordDialogOpen(true);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.id]: e.target.value,
    });
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();

    const errors = validatePasswordForm();
    setPasswordErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsChangingPassword(true);

    try {
      await api.put(`/user/${user.id}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully");
      setPasswordDialogOpen(false);
    } catch (error) {
      console.error("Error changing password:", error);

      if (error.response && error.response.status === 401) {
        setPasswordErrors({
          ...passwordErrors,
          currentPassword: "Current password is incorrect",
        });
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleSubmit = async (field) => {
    if (!editValue.trim()) {
      toast.error("Field cannot be empty");
      return;
    }
    setIsLoading(true);
    try {
      toast.loading(`Updating ${field} to ${editValue}`);

      await api.put(`/user/${user.id}/${field}`, { [field]: editValue });

      setUser((prevUser) => ({
        ...prevUser,
        [field]: editValue,
      }));

      toast.dismiss();
      toast.success(`Your ${field} has been updated`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.dismiss();
      toast.error(`Failed to update ${field}`);
    } finally {
      setIsLoading(false);
      setEditingField(null);
      setEditValue("");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const nameParts = name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  if (isLoading && !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Card className="glass-dark border border-gray-700/50 shadow-lg">
        <CardHeader className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <CardTitle className="gradient-text text-2xl">Profile</CardTitle>
            <CardDescription className="text-gray-300">
              View and edit your personal information
            </CardDescription>
          </div>
          <Avatar className="h-20 w-20 border border-teal-500/30">
            <AvatarImage src={user?.avatar || ""} alt={user?.name} />
            <AvatarFallback className="bg-gray-800 text-xl text-teal-400">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="space-y-6">
          {editableFields.map((field) => (
            <div key={field.id} className="space-y-1">
              <div className="text-sm font-medium text-gray-400">
                {field.label}
              </div>
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
                      className="border-gray-700 bg-gray-800/50"
                    />
                  </div>
                ) : (
                  <div className="flex-1 py-2 text-gray-300">
                    {user?.[field.id]}
                  </div>
                )}
                <div className="flex gap-2">
                  {editingField === field.id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleSubmit(field.id)}
                        disabled={isLoading}
                        className="bg-teal-500 px-2 hover:bg-teal-600"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="border-gray-700 px-2 hover:bg-gray-700/70 hover:text-red-400"
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
              onClick={handleEditPass}
              className="border-gray-700 hover:bg-gray-700/70 hover:text-teal-400"
            >
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="glass-dark border border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-teal-400">Change Password</DialogTitle>
            <DialogDescription className="text-gray-300">
              Enter your current password and a new password to update your
              credentials.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmitPasswordChange}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-white">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="border-gray-700 bg-gray-800/50"
                disabled={isChangingPassword}
              />
              {passwordErrors.currentPassword && (
                <p className="text-sm text-red-400">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-white">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="border-gray-700 bg-gray-800/50"
                disabled={isChangingPassword}
              />
              {passwordErrors.newPassword && (
                <p className="text-sm text-red-400">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="border-gray-700 bg-gray-800/50"
                disabled={isChangingPassword}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-400">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPasswordDialogOpen(false)}
                disabled={isChangingPassword}
                className="border-gray-700 hover:bg-gray-700/70 hover:text-red-400"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isChangingPassword}
                className="bg-gradient-to-r from-teal-500 to-teal-400 text-white shadow-lg transition-all duration-300 hover:from-teal-400 hover:to-teal-500 hover:shadow-teal-500/25"
              >
                {isChangingPassword ? (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">Updating</span>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  </div>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

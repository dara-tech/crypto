import { useState, useEffect } from "react"
import { AlertCircle, User, Mail, Save, Lock, Settings, Shield } from "lucide-react"
import { useTranslation } from 'react-i18next'
import useAuth from "../../../hooks/useAuth"
import ProfilePicture from "../../admin/profile/components/ProfilePicture"
import ChangePassword from "./components/ChangePassword"
import { motion, AnimatePresence } from "framer-motion"

const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 pt-20">
      <div className="max-w-5xl mx-auto">
        {/* Title Skeleton */}
        <div className="h-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl w-1/3 mb-8 animate-pulse"></div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <div className="lg:w-1/4">
            <div className="bg-base-100/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary/20">
              <ul className="menu menu-vertical w-full space-y-4">
                <li>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary/20 rounded-full animate-pulse"></div>
                    <div className="h-6 bg-primary/20 rounded-lg w-24 animate-pulse"></div>
                  </div>
                </li>
                <li>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary/20 rounded-full animate-pulse"></div>
                    <div className="h-6 bg-primary/20 rounded-lg w-24 animate-pulse"></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Main content Skeleton */}
          <div className="lg:w-3/4">
            <div className="bg-base-100/50 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20">
              {/* Profile Picture Skeleton */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 animate-pulse"></div>
                </div>
                <div className="h-4 bg-primary/20 rounded-lg w-32 mt-4 animate-pulse"></div>
              </div>

              {/* Form Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="h-5 bg-primary/20 rounded-lg w-1/4 animate-pulse"></div>
                  <div className="relative">
                    <div className="h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg animate-pulse"></div>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-primary/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-5 bg-primary/20 rounded-lg w-1/4 animate-pulse"></div>
                  <div className="relative">
                    <div className="h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg animate-pulse"></div>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-primary/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Button Skeleton */}
              <div className="form-control mt-8">
                <div className="h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Profile = () => {
  const { profile, loading, error, updateAdminProfile, getAdminProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePic: null
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState("/user.png")
  const [showUploadOptions, setShowUploadOptions] = useState(false)
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const { t } = useTranslation()

  // Fetch user profile on component mount
  useEffect(() => {
    getAdminProfile()
  }, [])

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        profilePic: profile.profilePic || null
      })
      setImagePreview(profile.profilePic || "/user.png")
    }
  }, [profile])


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSaveError("File size should be less than 5MB");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData(prev => ({
        ...prev,
        profilePic: file
      }));
      setSelectedImage(file);
      setSaveError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveError("")
    setSaveSuccess(false)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      
      // Always append the profile picture if selectedImage exists
      if (selectedImage) {
        formDataToSend.append('profilePic', selectedImage)
      } else if (formData.profilePic) {
        // If selectedImage is null but formData.profilePic exists (might be a string URL)
        // Only append if it's a File object
        if (formData.profilePic instanceof File) {
          formDataToSend.append('profilePic', formData.profilePic)
        }
      }

      const response = await updateAdminProfile(formDataToSend)
      setSaveSuccess(true)
      
      // Refresh profile data after update
      await getAdminProfile()
      
      // Reset the selectedImage to null after successful update
      setSelectedImage(null)
      
      // Show success message for 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveError(err.response?.data?.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordUpdate = async (passwordData) => {
    try {
      setIsPasswordUpdating(true)
      setSaveError("")
      
      const formDataToSend = new FormData()
      formDataToSend.append('currentPassword', passwordData.currentPassword)
      formDataToSend.append('newPassword', passwordData.newPassword)
      
      await updateAdminProfile(formDataToSend)
      setSaveSuccess(true)
      return true
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to update password")
      throw err
    } finally {
      setIsPasswordUpdating(false)
    }
  }

  if (loading && !profile) {
    return <ProfileSkeleton />
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 pt-20">
      <div className="max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          {t('update_profile')}
        </motion.h1>
        
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="alert alert-error mb-6 shadow-lg"
            >
              <AlertCircle className="w-6 h-6" />
              <span>{error}</span>
            </motion.div>
          )}

          {saveError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="alert alert-error mb-6 shadow-lg"
            >
              <AlertCircle className="w-6 h-6" />
              <span>{saveError}</span>
            </motion.div>
          )}

          {saveSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="alert alert-success mb-6 shadow-lg"
            >
              <span>Profile updated successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-base-100/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary/20"
            >
              <ul className="menu menu-vertical w-full">
                <li className={activeTab === "general" ? "bordered" : ""}>
                  <button 
                    className="flex items-center gap-3 text-base font-medium hover:bg-primary/10 transition-colors duration-300" 
                    onClick={() => setActiveTab("general")}
                  >
                    <User className="w-5 h-5" />
                    {t('General Info')}
                  </button>
                </li>
                <li className={activeTab === "security" ? "bordered" : ""}>
                  <button 
                    className="flex items-center gap-3 text-base font-medium hover:bg-primary/10 transition-colors duration-300" 
                    onClick={() => setActiveTab("security")}
                  >
                    <Shield className="w-5 h-5" />
                    {t('Security')}
                  </button>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Main content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-3/4"
          >
            <div className="bg-base-100/50 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20">
              {activeTab === "general" && (
                <motion.form 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <div className="flex flex-col items-center">
                      <ProfilePicture
                        imagePreview={imagePreview}
                        handleFileChange={(file) => {
                          if (file) {
                            const previewUrl = URL.createObjectURL(file);
                            setImagePreview(previewUrl);
                            setSelectedImage(file);
                            setFormData(prev => ({
                              ...prev,
                              profilePic: file
                            }));
                          }
                        }}
                        error={saveError}
                        setError={setSaveError}
                      />
                      {saveError && (
                        <p className="mt-2 text-sm text-error">{saveError}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-base font-medium">{t('form.name')}</span>
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="input input-bordered focus:outline-none w-full pl-10 bg-base-200/50 focus:bg-base-100 transition-all duration-300"
                          placeholder={t('form.enterName')}
                          required
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 group-focus-within:text-primary transition-colors duration-300 w-5 h-5" />
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-base font-medium">{t('form.email')}</span>
                      </label>
                      <div className="relative group">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input input-bordered focus:outline-none w-full pl-10 bg-base-200/50 focus:bg-base-100 transition-all duration-300"
                          placeholder={t('form.enterEmail')}
                          required
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 group-focus-within:text-primary transition-colors duration-300 w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="form-control mt-6">
                    <button 
                      type="submit" 
                      className={`btn btn-primary w-full relative overflow-hidden ${isSaving ? "loading" : ""}`}
                      disabled={isSaving}
                    >
                      <span className="relative z-10">
                        {isSaving ? (
                          t('saving')
                        ) : (
                          <>
                            <Save className="w-5 h-5 mr-2 inline" />
                            {t('saveChanges')}
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </motion.form>
              )}

              {activeTab === "security" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {t('profile.changePassword')}
                  </h2>
                  <ChangePassword onPasswordChange={handlePasswordUpdate} />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile

import { useState, useEffect } from "react"
import { AlertCircle, User, Mail, Save } from "lucide-react"
import useAuth from "../../../hooks/useAuth"
import ProfilePicture from "../../admin/profile/components/ProfilePicture"

const Profile = () => {
  const { profile, error, updateAdminProfile, getAdminProfile } = useAuth()
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

  // Fetch user profile on component mount
  useEffect(() => {
    getAdminProfile()
  }, [])

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile?.user) {
      setFormData({
        name: profile.user.name || "",
        email: profile.user.email || "",
        profilePic: profile.user.profilePic || null
      })
      // Set the image preview to the user's profile picture or default image
      setImagePreview(profile.user.profilePic || "/user.png")
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData({ ...formData, profilePic: file });
      setShowUploadOptions(false);
      setSelectedImage(file);
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
      if (selectedImage) {
        formDataToSend.append('profilePic', selectedImage)
      }

      await updateAdminProfile(formDataToSend)
      setSaveSuccess(true)
      // Refresh profile data after update
      getAdminProfile()
    } catch (err) {
      setSaveError("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        {error && (
          <div className="alert alert-error mb-6">
            <AlertCircle className="w-6 h-6" />
            <span>{error}</span>
          </div>
        )}

        {saveError && (
          <div className="alert alert-error mb-6">
            <AlertCircle className="w-6 h-6" />
            <span>{saveError}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="alert alert-success mb-6">
            <span>Profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 ">
            <div>
                
            </div>
          <div className="form-control">
           
            <ProfilePicture
              imagePreview={imagePreview}
              showUploadOptions={showUploadOptions}
              setShowUploadOptions={setShowUploadOptions}
              handleFileChange={handleFileChange}
              formData={formData}
              setImagePreview={setImagePreview}
              setFormData={setFormData}
              defaultImage="/user.png"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base">Name</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered focus:outline-none w-full pl-10"
                placeholder="Enter your name"
                required
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base">Email</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered focus:outline-none w-full pl-10"
                placeholder="Enter your email"
                required
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
            </div>
          </div>

          <div className="form-control mt-6">
            <button 
              type="submit" 
              className={`btn btn-primary w-full ${isSaving ? "loading" : ""}`}
              disabled={isSaving}
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile

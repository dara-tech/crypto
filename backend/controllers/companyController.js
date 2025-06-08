import Company from '../models/Company.js';
import cloudinary from '../lib/cloudinary.js';

// Create a new company
export const createCompany = async (req, res) => {
  try {
    const {
      name,
      about,
      mission,
      vision,
      privacyPolicy,
      contact,
      socialMedia,
      programsOffered
    } = req.body;

    const company = new Company({
      name,
      about,
      mission,
      vision,
      privacyPolicy,
      contact,
      socialMedia,
      programsOffered
    });

    // Handle logo upload if present
    if (req.files?.logo) {
      const logoResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'company_logos' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.files.logo[0].buffer);
      });
      company.logo = logoResult.secure_url;
    }

    // Handle hero images upload if present
    if (req.files?.heroImages) {
      const heroImagePromises = req.files.heroImages.map(image => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'company_hero_images' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(image.buffer);
        });
      });
      company.heroImages = await Promise.all(heroImagePromises);
    }

    // Handle testimonial images if present
    if (req.body.testimonials) {
      const testimonials = JSON.parse(req.body.testimonials);
      if (req.files?.testimonialImages) {
        const testimonialImagePromises = req.files.testimonialImages.map(image => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'company_testimonial_images' },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );
            uploadStream.end(image.buffer);
          });
        });
        const testimonialImageUrls = await Promise.all(testimonialImagePromises);
        
        company.testimonials = testimonials.map((testimonial, index) => ({
          ...testimonial,
          imageUrl: testimonialImageUrls[index]
        }));
      } else {
        company.testimonials = testimonials;
      }
    }

    await company.save();
    res.status(201).json({ message: 'Company created successfully', company });
  } catch (err) {
    console.error('Create company error:', err);
    res.status(500).json({ message: 'Server error while creating company' });
  }
};

// Get company details
export const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (err) {
    console.error('Get company error:', err);
    res.status(500).json({ message: 'Server error while fetching company' });
  }
};

// Update company details
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Update basic fields from request body
    const updateFields = [
      'name',
      'about',
      'mission', 
      'vision',
      'privacyPolicy',
      'contact',
      'socialMedia',
      'programsOffered'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        // Skip if the value is an empty array for heroImage
        if (field === 'heroImage' && Array.isArray(req.body[field])) {
          return; // Skip setting heroImage if it's an array
        }
        company[field] = req.body[field];
      }
    });

    // Handle heroImage specifically to prevent array assignment
    if (req.body.heroImage && !Array.isArray(req.body.heroImage)) {
      company.heroImage = req.body.heroImage;
    }

    // Handle single image uploads (logo, aboutImage, missionImage, visionImage, heroImage)
    const singleImageFields = {
      logo: 'company_logos',
      aboutImage: 'company_about_images',
      missionImage: 'company_mission_images',
      visionImage: 'company_vision_images'
      // Removed heroImage from here since it's handled separately
    };

    // Process single image uploads
    for (const [field, folder] of Object.entries(singleImageFields)) {
      if (req.files?.[field]?.[0]?.buffer) {
        try {
          const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(req.files[field][0].buffer);
          });
          company[field] = result.secure_url;
        } catch (error) {
          console.error(`Error uploading ${field} image:`, error);
          // Don't fail the whole request if a single image upload fails
        }
      }
    }

    // Handle heroImage upload separately
    if (req.files?.heroImage?.[0]?.buffer) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'company_hero_images' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.files.heroImage[0].buffer);
        });
        company.heroImage = result.secure_url;
      } catch (error) {
        console.error('Error uploading hero image:', error);
        // Don't fail the whole request if hero image upload fails
      }
    }

    // Handle hero images (array) update if present
    if (req.files?.heroImages) {
      // Filter out any empty values that might come from the form
      const validHeroImages = req.files.heroImages.filter(img => img && img.buffer && img.buffer.length > 0);
      
      if (validHeroImages.length > 0) {
        const heroImagePromises = validHeroImages.map(image => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'company_hero_images' },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );
            uploadStream.end(image.buffer);
          });
        });
        
        try {
          const newHeroImageUrls = await Promise.all(heroImagePromises);
          
          // Initialize heroImages as array if it doesn't exist
          if (!company.heroImages || !Array.isArray(company.heroImages)) {
            company.heroImages = [];
          }
          
          // Filter out any empty strings from existing heroImages
          company.heroImages = company.heroImages.filter(Boolean);
          
          // Add new images to the array
          company.heroImages = [...company.heroImages, ...newHeroImageUrls];
        } catch (err) {
          console.error('Error uploading hero images:', err);
          // Don't fail the whole request if hero image upload fails
        }
      }
    }

    // Handle testimonials update
    if (req.body.testimonials) {
      const testimonials = JSON.parse(req.body.testimonials);
      if (req.files?.testimonialImages) {
        const testimonialImagePromises = req.files.testimonialImages.map(image => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'company_testimonial_images' },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );
            uploadStream.end(image.buffer);
          });
        });
        const testimonialImageUrls = await Promise.all(testimonialImagePromises);
        
        company.testimonials = testimonials.map((testimonial, index) => ({
          ...testimonial,
          imageUrl: testimonialImageUrls[index] || testimonial.imageUrl
        }));
      } else {
        company.testimonials = testimonials;
      }
    }

    const updatedCompany = await company.save();
    res.status(200).json({ 
      message: 'Company updated successfully', 
      company: updatedCompany 
    });

  } catch (err) {
    console.error('Update company error:', err);
    res.status(500).json({ message: 'Server error while updating company' });
  }
};

// Delete company
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (err) {
    console.error('Delete company error:', err);
    res.status(500).json({ message: 'Server error while deleting company' });
  }
};

// Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (err) {
    console.error('Get all companies error:', err);
    res.status(500).json({ message: 'Server error while fetching companies' });
  }
};

import Campany from '../models/Campany.js';
import cloudinary from '../lib/cloudinary.js';

// Create a new campany
export const createCampany = async (req, res) => {
  try {
    const {
      name,
      about,
      mission,
      vision,
      contact,
      socialMedia,
      programsOffered
    } = req.body;

    const campany = new Campany({
      name,
      about,
      mission,
      vision,
      contact,
      socialMedia,
      programsOffered
    });

    // Handle logo upload if present
    if (req.files?.logo) {
      const logoResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'campany_logos' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.files.logo[0].buffer);
      });
      campany.logo = logoResult.secure_url;
    }

    // Handle hero images upload if present
    if (req.files?.heroImages) {
      const heroImagePromises = req.files.heroImages.map(image => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'campany_hero_images' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(image.buffer);
        });
      });
      campany.heroImages = await Promise.all(heroImagePromises);
    }

    // Handle testimonial images if present
    if (req.body.testimonials) {
      const testimonials = JSON.parse(req.body.testimonials);
      if (req.files?.testimonialImages) {
        const testimonialImagePromises = req.files.testimonialImages.map(image => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'campany_testimonial_images' },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );
            uploadStream.end(image.buffer);
          });
        });
        const testimonialImageUrls = await Promise.all(testimonialImagePromises);
        
        campany.testimonials = testimonials.map((testimonial, index) => ({
          ...testimonial,
          imageUrl: testimonialImageUrls[index]
        }));
      } else {
        campany.testimonials = testimonials;
      }
    }

    await campany.save();
    res.status(201).json({ message: 'Campany created successfully', campany });
  } catch (err) {
    console.error('Create campany error:', err);
    res.status(500).json({ message: 'Server error while creating campany' });
  }
};

// Get campany details
export const getCampany = async (req, res) => {
  try {
    const campany = await Campany.findById(req.params.id);
    if (!campany) {
      return res.status(404).json({ message: 'Campany not found' });
    }
    res.status(200).json(campany);
  } catch (err) {
    console.error('Get campany error:', err);
    res.status(500).json({ message: 'Server error while fetching campany' });
  }
};

// Update campany details
export const updateCampany = async (req, res) => {
  try {
    const campany = await Campany.findById(req.params.id);
    if (!campany) {
      return res.status(404).json({ message: 'Campany not found' });
    }

    // Update basic fields from request body
    const updateFields = [
      'name',
      'about',
      'mission', 
      'vision',
      'contact',
      'socialMedia',
      'programsOffered'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        campany[field] = req.body[field];
      }
    });

    // Handle image uploads if present
    const imageFields = {
      logo: 'campany_logos',
      aboutImage: 'campany_about_images',
      missionImage: 'campany_mission_images', 
      visionImage: 'campany_vision_images'
    };

    for (const [field, folder] of Object.entries(imageFields)) {
      if (req.files?.[field]) {
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
        campany[field] = result.secure_url;
      }
    }

    // Handle hero images update if present
    if (req.files?.heroImages) {
      const heroImagePromises = req.files.heroImages.map(image => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'campany_hero_images' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(image.buffer);
        });
      });
      const heroImageUrls = await Promise.all(heroImagePromises);
      campany.heroImages = heroImageUrls;
    }

    // Handle testimonials update
    if (req.body.testimonials) {
      const testimonials = JSON.parse(req.body.testimonials);
      if (req.files?.testimonialImages) {
        const testimonialImagePromises = req.files.testimonialImages.map(image => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'campany_testimonial_images' },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );
            uploadStream.end(image.buffer);
          });
        });
        const testimonialImageUrls = await Promise.all(testimonialImagePromises);
        
        campany.testimonials = testimonials.map((testimonial, index) => ({
          ...testimonial,
          imageUrl: testimonialImageUrls[index] || testimonial.imageUrl
        }));
      } else {
        campany.testimonials = testimonials;
      }
    }

    const updatedCampany = await campany.save();
    res.status(200).json({ 
      message: 'Campany updated successfully', 
      campany: updatedCampany 
    });

  } catch (err) {
    console.error('Update campany error:', err);
    res.status(500).json({ message: 'Server error while updating campany' });
  }
};

// Delete campany
export const deleteCampany = async (req, res) => {
  try {
    const campany = await Campany.findByIdAndDelete(req.params.id);
    if (!campany) {
      return res.status(404).json({ message: 'Campany not found' });
    }
    res.status(200).json({ message: 'Campany deleted successfully' });
  } catch (err) {
    console.error('Delete campany error:', err);
    res.status(500).json({ message: 'Server error while deleting campany' });
  }
};

// Get all campanies
export const getAllCampanies = async (req, res) => {
  try {
    const campanies = await Campany.find();
    res.status(200).json(campanies);
  } catch (err) {
    console.error('Get all campanies error:', err);
    res.status(500).json({ message: 'Server error while fetching campanies' });
  }
};

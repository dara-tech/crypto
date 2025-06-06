import School from '../models/School.js';
import cloudinary from '../lib/cloudinary.js';

// Create a new school
export const createSchool = async (req, res) => {
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

    const school = new School({
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
          { folder: 'school_logos' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.files.logo[0].buffer);
      });
      school.logo = logoResult.secure_url;
    }

    // Handle hero images upload if present
    if (req.files?.heroImages) {
      const heroImagePromises = req.files.heroImages.map(image => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'school_hero_images' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(image.buffer);
        });
      });
      school.heroImages = await Promise.all(heroImagePromises);
    }

    // Handle testimonial images if present
    if (req.body.testimonials) {
      const testimonials = JSON.parse(req.body.testimonials);
      if (req.files?.testimonialImages) {
        const testimonialImagePromises = req.files.testimonialImages.map(image => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'school_testimonial_images' },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );
            uploadStream.end(image.buffer);
          });
        });
        const testimonialImageUrls = await Promise.all(testimonialImagePromises);
        
        school.testimonials = testimonials.map((testimonial, index) => ({
          ...testimonial,
          imageUrl: testimonialImageUrls[index]
        }));
      } else {
        school.testimonials = testimonials;
      }
    }

    await school.save();
    res.status(201).json({ message: 'School created successfully', school });
  } catch (err) {
    console.error('Create school error:', err);
    res.status(500).json({ message: 'Server error while creating school' });
  }
};

// Get school details
export const getSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.status(200).json(school);
  } catch (err) {
    console.error('Get school error:', err);
    res.status(500).json({ message: 'Server error while fetching school' });
  }
};

// Update school details
export const updateSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
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
        school[field] = req.body[field];
      }
    });

    // Handle image uploads if present
    const imageFields = {
      logo: 'school_logos',
      aboutImage: 'school_about_images',
      missionImage: 'school_mission_images', 
      visionImage: 'school_vision_images'
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
        school[field] = result.secure_url;
      }
    }

    // Handle hero images update if present
    if (req.files?.heroImages) {
      const heroImagePromises = req.files.heroImages.map(image => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'school_hero_images' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(image.buffer);
        });
      });
      const heroImageUrls = await Promise.all(heroImagePromises);
      school.heroImages = heroImageUrls;
    }

    // Handle testimonials update
    if (req.body.testimonials) {
      const testimonials = JSON.parse(req.body.testimonials);
      if (req.files?.testimonialImages) {
        const testimonialImagePromises = req.files.testimonialImages.map(image => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'school_testimonial_images' },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );
            uploadStream.end(image.buffer);
          });
        });
        const testimonialImageUrls = await Promise.all(testimonialImagePromises);
        
        school.testimonials = testimonials.map((testimonial, index) => ({
          ...testimonial,
          imageUrl: testimonialImageUrls[index] || testimonial.imageUrl
        }));
      } else {
        school.testimonials = testimonials;
      }
    }

    const updatedSchool = await school.save();
    res.status(200).json({ 
      message: 'School updated successfully', 
      school: updatedSchool 
    });

  } catch (err) {
    console.error('Update school error:', err);
    res.status(500).json({ message: 'Server error while updating school' });
  }
};

// Delete school
export const deleteSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.status(200).json({ message: 'School deleted successfully' });
  } catch (err) {
    console.error('Delete school error:', err);
    res.status(500).json({ message: 'Server error while deleting school' });
  }
};

// Get all schools
export const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find();
    res.status(200).json(schools);
  } catch (err) {
    console.error('Get all schools error:', err);
    res.status(500).json({ message: 'Server error while fetching schools' });
  }
};

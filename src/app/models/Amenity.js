import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100 
  },
  category: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length > 0; 
      },
      message: 'At least one category is required'
    }
  },
  img_path: {
    type: String,
    required: true
  },
  airports: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length > 0; 
      },
      message: 'At least one airport code is required'
    }
  }
}, {
  timestamps: true 
});

const Amenity = mongoose.models.xAmenities || mongoose.model('xAmenities', amenitySchema, 'xAmenities');

export default Amenity;
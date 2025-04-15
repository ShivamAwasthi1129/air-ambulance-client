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
  icon_svg: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^data:image\/svg\+xml;base64,/.test(v); 
      },
      message: 'Invalid SVG base64 string'
    }
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

const Amenity = mongoose.model('Amenity', amenitySchema, 'xAmenities');

export default Amenity;
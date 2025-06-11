import mongoose from 'mongoose';
const serviceSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  service_type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceTypes' },
  business_name: { type: String, required: true },
  open_till: { type: String, required: true },
  airport: { type: String, required: true },
  provider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Providers' },
  ratings: { type: Number, required: true, min: 0, max: 5 },
  images: [{ type: String }],
  contact_number: { type: String, required: true },
  address: {
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
}, { collection: 'Services' });
const Service = mongoose.models.Services || mongoose.model('Services', serviceSchema);
export default Service;
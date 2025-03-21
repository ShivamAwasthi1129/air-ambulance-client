import mongoose from "mongoose";

const FleetTimeScheme = new mongoose.Schema(
  {
    fleet_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aircraft",
      required: true,
    },
    departure_time: { type: Date, required: true },
    arrival_time: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return this.departure_time <= value;
        },
        message: "Arrival time must be after departure time",
      },
    },
  },
  { timestamps: true }
);

FleetTimeScheme.index({ fleet_id: 1 });
FleetTimeScheme.index({ departure_time: 1 });

export default mongoose.models.FleetTime ||
  mongoose.model("FleetTime", FleetTimeScheme, "FleetTime");

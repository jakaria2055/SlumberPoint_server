import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: String, ref: "users", required: true },
    room: { type: String, ref: "rooms", required: true },
    hotel: { type: String, ref: "hotels", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    guests: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Pay At Hotel",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("bookings", bookingSchema);

export default Booking;

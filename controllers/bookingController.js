import transporter from "../config/nodeMailer.js";
import Booking from "../models/BookingModel.js";
import Hotel from "../models/HotelModel.js";
import Room from "../models/RoomModel.js";

//TO CHECK AVAILABILITY OF ROOM
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.log(error.message);
  }
};

//api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = checkAvailability({ room, checkInDate, checkOutDate });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: true, message: error.message });
  }
};

// POST /api/bookings/book (Creating Booking)
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not Available." });
    }

    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    //CALCULATE TOTAL PRICE BASED ON NIGHT
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const night = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice = totalPrice * night;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    const mailOptions = {
      from: process.env.SENDER_MAIL,
      to: req.user.email,
      subject: 'SlumberPoint Hotel Booking Details',
      html: `
         <h2>Your Booking Details</h2>
         <p>Dear ${req.user.userName},</p>
         <p>Thanks for your Booking. Here is Your Details: </p>
         <ul>
          <li>Booking ID: <strong>${booking._id}</strong></li>
          <li>Hotel Name: <strong>${roomData.hotel.name}</strong></li>
          <li>Location: <strong>${roomData.hotel.address}</strong></li>
          <li>Bill Amount: <strong>$ ${booking.totalPrice} /night </strong></li>
         </ul>

         <p>We Look forward to welcoming you):</p>
         <p>If there need any changes please feel free to contact us):</p>
      `
    }

    await transporter.sendMail(mailOptions)

    res.json({ success: true, message: "Booking Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//HOTEL BOOKING INFO
export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.json({ success: false, message: "No hotel Found!!" });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    //TOTAL BOOKING
    const totalBookings = bookings.length;
    //TOTAL REVENUE
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );

    res.json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, bookings },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

import Hotel from "../models/HotelModel.js";
import User from "../models/User.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user?._id;

    if (!owner) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. User not found" });
    }

    console.log("Owner ID:", owner);

    const hotel = await Hotel.findOne({ owner });
    if (hotel) {
      return res.json({ success: false, message: "Hotel Already Created" });
    }

    await Hotel.create({ name, address, contact, city, owner });

    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.json({ success: true, message: "Hotel Registered Successfully" });
  } catch (error) {
    console.error("Register Hotel Error:", error);
    res.json({ success: false, message: error.message });
  }
};

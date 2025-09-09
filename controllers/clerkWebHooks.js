import user from "../models/User.js";
import { Webhook } from "svix";

const clerkWebHook = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const payload = req.body.toString(); // ✅ Raw body as string
    const evt = whook.verify(payload, headers); // ✅ Correct way
    const { data, type } = evt;

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      userName: `${data.first_name} ${data.last_name}`,
      image: data.image_url,
      recentSearchCities: [],
    };

    switch (type) {
      case "user.created": {
        console.log("📨 Creating user:", userData);
        await user.create(userData);
        console.log("✅ User created:", userData);
        break;
      }
      case "user.updated": {
        await user.findByIdAndUpdate(data.id, userData);
        break;
      }
      case "user.deleted": {
        await user.findByIdAndDelete(data.id);
        break;
      }
      default:
        console.log("ℹ️ Unhandled event type:", type);
        break;
    }

    res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebHook;

import user from "../models/User.js";
import { Webhook } from "svix";

const clerkWebHook = async (req, res) => {
  try {
    // CREATE SVIX INSTANCE WITH CLRK WEBHOOK
    const whook = new Webhook(process.env.CLERK_WEBHOOK);

    //GETTING HEADERS
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    //VERIFYING HEADERS
    await whook.verify(JSON.stringify(req.body), headers);

    //GETTING DATA FROM REQUEST BODY
    const { data, type } = req.body;

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      userName: data.first_name + " " + data.last_name,
      image: data.image_url,
      recentSearchCities: [],
    };

switch (type) {
  case "user.created": {
    console.log("📨 Creating user:", userData);
    const created = await user.create(userData);
    console.log("✅ Saved to DB:", created);
    break;
  }
  case "user.updated": {
    console.log("📨 Updating user:", data.id);
    await user.findByIdAndUpdate(data.id, userData);
    break;
  }
  case "user.deleted": {
    console.log("📨 Deleting user:", data.id);
    await user.findByIdAndDelete(data.id);
    break;
  }
}

    res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.log("❌ Webhook error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebHook;

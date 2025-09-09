import user from "../models/User.js";
import { Webhook } from "svix";

const clerkWebHook = async (req, res) => {
  try {
    // CREATE SVIX INSTANCE WITH CLRK WEBHOOK
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

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

    //SWITCH FOR DIFF EVENT
    switch (type) {
      case "user.created": {
        await user.create(userData);
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
        break;
    }
    res.json({success: true, message: "WebHook Received"});
  } catch (error) {
    console.log(error)
    res.json({success:false,message: error.message});
  }
};

export default clerkWebHook;

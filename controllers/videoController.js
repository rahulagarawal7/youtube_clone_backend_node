import Video from "../models/Video.js";

export const addVideo = async (req, res) => {
  try {
    const { title, description, thumbnailUrl, videoID } = req.body;

    // ✅ Get channel from authenticated user
    const user = req.user; // already attached by protect
    if (!user.channel) {
      return res.status(400).json({ message: "User does not have a channel" });
    }

    // ✅ Create new video linked to user's channel
    const newVideo = new Video({
      title,
      description,
      thumbnailUrl,
      videoID,
      channel: user.channel,
    });

    await newVideo.save();

    res.status(201).json({
      success:true,
      message: "Video uploaded successfully",
    });
  } catch (error) {
    console.error("❌ Error in addVideo:", error.message);
    res.status(500).json({  success:false, message: "Server error", error: error.message });
  }
};


// ✅ Get all videos (public)
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("channel", "name avatar") // include channel name & avatar
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (error) {
    console.error("❌ Error in getAllVideos:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get videos of logged-in user's channel
export const getMyChannelVideos = async (req, res) => {
  try {
    if (!req.user.channel) {
      return res.status(400).json({ message: "User does not have a channel" });
    }

    const videos = await Video.find({ channel: req.user.channel })
      .populate("channel", "name avatar")
      .sort({ createdAt: -1 });

    
    res.status(200).json({success:true, message:"Successfully fetched all the channel videos",videos});
  } catch (error) {
    console.error("❌ Error in getMyChannelVideos:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
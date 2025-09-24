import { json } from "express";
import Channel from "../models/Channel.js";
import User from "../models/User.js";

export const createChannel = async (req, res) => {
  try {
    const { name, description, avatar, banner } = req.body;

    // check if user already has channel
    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.hasChannel) {
      return res
        .status(400)
        .json({ success: false, message: "User already has a channel" });
    }

    const channel = await Channel.create({
      user: req.user.id,
      name,
      description,
      banner,
      avatar,
      subscribers: [],
    });

    // update user
    user.hasChannel = true;
    user.channel = channel._id;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Channel Created Successfully",
      channel,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" });
    }
    if (channel.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const updated = await Channel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "Channel Updated Successfully",
      channel: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" });
    }

    res.status(200).json({ success: true, channel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find()
      .populate("user", "fullName email") // get user info also,
      .sort({ createdAt: -1 }); // new will come first

    res.json({ success: true, count: channels.length, channels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleSubscription = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id; // from JWT middleware

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found!!" });
    }

    console.log("")

    // ✅ Prevent subscribing to own channel
    if (channel?.user?.toString() === userId?.toString()) {
      return res.status(400).json({
        success: true,
        message: "You cannot subscribe to your own channel",
      });
    }

    // check if user already subscribed
    const isSubscribed = channel.subscribers.includes(userId);

    if (isSubscribed) {
      // unsubscribe
      channel.subscribers.pull(userId);
      await channel.save();
      return res.json({ success: true, message: "Unsubscribed successfully" });
    } else {
      // subscribe
      channel.subscribers.push(userId);
      await channel.save();
      return res.json({ success: true, message: "Subscribed successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message, error: error.message });
  }
};

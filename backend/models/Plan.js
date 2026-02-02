import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    planText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);

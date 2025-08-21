import { RequestStatus } from "@/lib/types/request";
import { model, models, Schema } from "mongoose";

export interface IRequest extends Document {
  requestorName: string;
  itemRequested: string;
  requestCreatedDate: Date;
  lastEditedDate?: Date;
  status: RequestStatus;
}

const RequestSchema: Schema = new Schema({
  requestorName: {
    type: String,
    required: [true, "Requestor name is required"],
    minlength: [3, "Requestor name must be at least 3 characters long"],
    maxlength: [30, "Requestor name cannot exceed 30 character"],
  },
  itemRequested: {
    type: String,
    required: [true, "Item requested is required."],
    minlength: [2, "Item requested name must be at least 3 characters long"],
    maxlength: [100, "Item requested cannot exceed 100 character"],
  },
  requestCreatedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  lastEditedDate: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
    emum: {
      values: Object.values(RequestStatus),
      message: "{VALUE} is not supported",
    },
    //maybe let new item be pending status
    default: RequestStatus.PENDING,
  },
});

export default Request =
  models.Request || model<IRequest>("Request", RequestSchema);

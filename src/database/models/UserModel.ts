import mongoose, {Document, Schema} from "mongoose";
import validator from "validator";
export interface IUser extends Document {
   firstName: string;
   lastName: string;
   phone: string;
   email: string;
   NIN: string;
   password: string;
   isEmailVerified: boolean;
   verificationToken: string | null;
}
const UserSchema: Schema = new Schema(
    {
        firstName: {
            type: String,
            trim: true,
            required: [true, "firstname is required"],
            minlength: 3
        },
        lastName: {
            type: String,
            trim: true,
            required: [true, "lastname is required"],
            minlength: 3
        },
        phone: {
            type: String,
            trim: true,
            required: [true, "phone is required"],
            minlength: 11
        },
        NIN: {
            type: String,
            trim: true,
            required: [true, "NIN is required"],
            minlength: 11
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "Please provide a valid email."],
        },

        password: {
            type: String,
            trim: false,
            required: [true, "Password must be provided"],
            minlength: 8,
            validate: {
                validator: function(value: string) {
                    return value !== undefined; // Ensures password is not undefined
                },
                message: "Password cannot be undefined",
            },
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
          },
          verificationToken: {
            type: String,
            default: null,
          },
          
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;


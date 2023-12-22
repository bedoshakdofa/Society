const mongoose = require("mongoose");
const { validator } = require("validator");
const { bcrypt } = require("bcrypt");

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        tirm: [true],
        required: [true, "you must have username"],
        maxlength: [30, "username must at most 30 charcter"],
        minlength: [1, "username must be al least 1 charcter"],
    },
    email: {
        type: String,
        unique: [true, "this Email is taken "],
        required: [true, "must provide an email"],
        validate: [validator.isEmail, "incorrect form"],
        lowercase: true,
        tirm: [true],
    },
    Password: {
        type: String,
        required: [true, "password is required"],
    },
    PasswordConfirm: {
        type: String,
        required: [true, "password confirm is required"],
        validate: {
            validator: function (el) {
                return el === this.Password;
            },
            message: "the password does not match",
        },
    },
    pic: {
        type: String,
        required: true,
        default:
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    timestamps: {
        type: Boolean,
        default: true,
    },
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("Password")) return next();
    this.Password = await bcrypt.hash(this.Password, 12);
    this.PasswordConfirm = undefined;
});

UserSchema.methods.Checkpassword = async function (candidatepass, userpass) {
    return await bcrypt.compare(candidatepass, userpass);
};

UserSchema.methods.isPasswordChange = function (JWTTimeStamp) {
    if (this.PasswordChangeAt) {
        const TimeChange = parseInt(this.PasswordChangeAt.getTime() / 1000, 10);
        return JWTTimeStamp < TimeChange;
    }
    return false;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;

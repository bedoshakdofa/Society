const User = require("./../Models/UserModule");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "90d",
    });
};

exports.signup = async (req, res, next) => {
    const currentuser = await User.create(req.body);
    const token = signToken(currentuser._id);
    res.status(200).json({
        status: "sucess",
        token,
        data: {
            currentuser,
        },
    });
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return new Error("please provide an email and password");

    const currantuser = await User.findOne({ email }).select("+password");

    if (
        !currantuser ||
        !(await currantuser.Checkpassword(password, currantuser.Password))
    )
        return new Error("invaild email or password");

    const token = signToken(currantuser._id);
    res.status(200).json({
        status: "success",
        token,
    });
};

exports.protect = async (req, res, next) => {
    //fisrt seek for token in request
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    //if not found raise an error
    if (!token) {
        return new Error("your are not login please login ");
    }
    //verfify the token we take
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //check if there a user for this token
    const currantuser = await User.findById(decode.id);

    if (!currantuser) {
        return new Error("invaild email or password");
    }
    // check if the user change the password after jwt issued
    if (currantuser.isPasswordChange(decode.iat)) {
        return new Error("you have change your password recently ");
    }
    req.user = currantuser;
    next();
};

exports.test = (req, res, next) => {
    console.log(req.body);
    res.status(200).json({
        status: "success",
    });
};

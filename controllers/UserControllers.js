const User = require("./../Models/UserModule");

exports.SearchUser = async (req, res) => {
    let query;
    if (req.query.search) {
        query = {
            $or: [{ name: { $regex: req.query.search, $options: "i" } }],
            $or: [{ email: { $regex: req.query.search, $options: "i" } }],
        };
    }
    const users = await User.find(query)
        .find({ _id: { $ne: req.user.id } })
        .select("-Password");
    res.status(200).json({
        status: "success",
        data: {
            users,
        },
    });
};

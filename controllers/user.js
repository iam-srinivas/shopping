const User = require("../models/user")


exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec(
        (error, user) => {
            if (error || !user) {
                return res.status(400).json({
                    error: "No User Found"
                })
            }
            req.profile = user
            next();
        }
    )
}

exports.getUser = (req, res) => {
    // TODO:
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    req.profile.role = undefined;
    req.profile.__v = undefined;
    return res.json(req.profile)
}


exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {
            _id: req.profile._id
        },
        {
            $set: req.body
        },
        {
            new: true, useFindAndModify: false
        },
        (error, user) => {
            if (error) {
                return res.status(400).json({
                    error: "Unable to Update"
                })
            }
            user.salt = undefined;
            user.encry_password = undefined;
            user.createdAt = undefined;
            user.updatedAt = undefined;
            user.role = undefined;
            user.__v = undefined;
            res.json(user)
        }
    )
}
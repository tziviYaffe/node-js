import {
  User,
  userValidator,
  userValidatorWithOutEmail,
} from "../models/userModel.js";

export const addUser = async (req, res) => {
  let { userName, email, phone } = req.body;
  if (!userName || !email || !phone)
    return res.status(404).send("missing required parameters");
  let validate = userValidator({ userName, email, phone });
  if (validate.error) return res.status(400).send(validate.error.details);
  try {
    let sameEmail = await User.findOne({ email });
    if (sameEmail) return res.status(409).send("your email already exists");
    let newUser = await User.create({ userName, email, phone });
    return res.json(newUser).status(201);
  } catch (err) {
    res.status(400).send("unable to add this user " + err);
  }
};

export const updateUser = async (req, res) => {
  let { id } = req.params;
  let { email, phone, userName } = req.body;
  let validate;
  // if (!mongoose.isValidObjectId(id))
  //   return res.status(400).send("invalid paramter id");
  try {
    let userToUpdate = await User.findById(id);
    console.log(userToUpdate);
    if (!userToUpdate)
      return res.status(404).send("there is no user with this id");
    userToUpdate.userName = userName || userToUpdate.userName;
    userToUpdate.email = email || userToUpdate.email;
    userToUpdate.phone = phone || userToUpdate.phone;
    if (email) {
      validate = userValidator({ userName, email, phone });
      if (validate.error) return res.status(400).send(validate.error.details);
    } else {
      validate = userValidatorWithOutEmail({ userName, phone });
      if (validate.error) return res.status(400).send(validate.error.details);
    }
    await userToUpdate.save();
    return res.json(userToUpdate).status(201);
  } catch (err) {
    return res.status(400).send("an error occurred " + err);
  }
};

export const deleteUser = async (req, res) => {
  let { id } = req.params;
  // if (!mongoose.isValidObjectId(id))
  //   return res.status(400).send("invalid paramter id");
  User.deleteOne({ _id: id })
    .then(() => {
      res.status(200).json({
        massage: `user _id- ${id} Delete `,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
};

export const getUserById = async (req, res) => {
  let { id } = req.params;
  try {
    User.findById(id).then((user) => {
      res.status(200).json({
        user,
      });
    });
  } catch (err) {
    return res.status(400).send("an error occurred " + err);
  }
};

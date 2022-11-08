const Jobs = require("../database/jobs");
const User = require("../database/user");

module.exports = {
  createHirer: async (req, res) => {
    const { id } = req.user;
    const hirerDetails = req.body;
    try {
      const user = await User.findById(id);
      if (user.hiring) {
        return res.status(403).json({
          message: "already applied to be a hirer",
        });
      }
      await Jobs.createHirer(hirerDetails, id);
      res
        .status(201)
        .json({ message: "Request to be a hirer has succesfully sended" });
    } catch (error) {
      res.status(500);
    }
  },
};

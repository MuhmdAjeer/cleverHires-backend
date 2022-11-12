const Jobs = require("../database/jobs");
const User = require("../database/user");

exports.createHirer = async (req, res) => {
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
};

exports.getHirer = async (req, res) => {
  const { id } = req.user;
  try {
    const hirer = User.findById(id);
    if (!hirer.hiring || !hirer?.hiring?.approved) {
      return res.status(200).json({
        hirer: false,
        message: "first request to be an hirer",
      });
    }

    return res.status(200).json({
      hirer: true,
      details: hirer.hiring,
    });
  } catch (error) {
    res.stauts(500).json({ message: error.message });
  }
};

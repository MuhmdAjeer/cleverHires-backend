const { LoggerLevel } = require("mongodb");
const Jobs = require("../database/jobs");
const User = require("../database/user");

exports.createHirer = async (req, res) => {
  const { id } = req.user;
  const hirerDetails = req.body;

  try {
    
    const user = await User.findById(id);
    if (user.hiring) {
      return res.status(403).json({
        message: "already  applied to be a hirer",
      });
    }

    await Jobs.createHirer(hirerDetails, id);
    res.status(201).json({ message: "Request to be a hirer has succesfully sended" });

  } catch (error) {
    res.status(500);
  }
};

exports.getHirer = async (req, res) => {
  const { id } = req.user;
  try {

    const hirer = await User.findById(id);

    if (!hirer?.hiring?.approved) {
      return res.status(200).json({
        hirer: false,
        message: "first request to be a hirer",
      });
    }

    return res.status(200).json({
      hirer: true,
      details: hirer.hiring,
    })

  } catch (error) {

    res.stauts(500).json({ message: error.message });
  }
};

exports.postJob = async (req, res) => {
  try {

    const hirer = await User.findById(req.user.id);
    console.log(hirer);

    if (hirer?.hiring?.approved) {
      return res.status(403).json({
        message: "Become a hirer to post job"
      })
    }



    let jobId;
    req.body.hirer = hirer._id;

    console.log(req.body);
    try {
      jobId = await Jobs.uploadJob(req.body);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ err })
    }


    return res.status(201).json({
      message: "Job uploaded successfully",
      jobId
    })

  } catch (error) {
    console.log('hello');
    res.status(500).json({ error: error.message })
  }
}

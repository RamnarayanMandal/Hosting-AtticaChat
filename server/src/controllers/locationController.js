const Location = require("../model/locationModel");

const saveLocation = async (req, res) => {
  const { managerId, longitude, latitude } = req.body;

  try {
    let location = await Location.findOne({ managerId });

    if (location) {
      // Update existing location object by pushing new location into the array
      location.locations.push({ longitude, latitude });
    } else {
      // If no location object exists, create a new one with the initial location
      location = new Location({ managerId, locations: [{ longitude, latitude }] });
    }

    await location.save();
    res.status(201).send(location);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const location = await Location.find({ managerId: id });
    if (location) {
      res.status(200).json({ location });
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



module.exports = { saveLocation,getLocation };

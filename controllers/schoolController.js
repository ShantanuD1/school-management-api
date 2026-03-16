const db = require("../db");

exports.addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (
    typeof name !== "string" ||
    typeof address !== "string" ||
    name.trim() === "" ||
    address.trim() === ""
  ) {
    return res.status(400).json({ message: "name and address are required strings" });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return res.status(400).json({ message: "latitude and longitude must be numbers" });
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return res
      .status(400)
      .json({ message: "latitude must be between -90 and 90, longitude between -180 and 180" });
  }

  const sql = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";

  db.query(sql, [name.trim(), address.trim(), lat, lon], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to add school", error: err });
    }

    res.status(201).json({
      message: "School added successfully",
      id: result.insertId,
    });
  });
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

exports.listSchools = (req, res) => {
  const lat = parseFloat(req.query.latitude);
  const lon = parseFloat(req.query.longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return res
      .status(400)
      .json({ message: "latitude and longitude query params are required numbers" });
  }

  db.query("SELECT id, name, address, latitude, longitude FROM schools", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch schools", error: err });
    }

    const schools = results
      .map((school) => {
        const distance = calculateDistance(lat, lon, school.latitude, school.longitude);
        return { ...school, distanceInKm: Number(distance.toFixed(3)) };
      })
      .sort((a, b) => a.distanceInKm - b.distanceInKm);

    res.json(schools);
  });
};

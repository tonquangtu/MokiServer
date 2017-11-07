const { Device } = global;

exports.addDevice = (deviceParam) => {
  const {
    userId,
    deviceToken,
    expiredAt,
  } = deviceParam;

  const device = new Device({
    userId,
    deviceToken,
    expiredAt,
  });

  return device.save();
};


exports.findAndUpdateDevice =
  (userId, updateData, options) => Device.findOneAndUpdate({ user: userId }, updateData, options);

exports.findDeviceByUserId = userId => Device.findOne({ user: userId });

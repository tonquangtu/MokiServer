const { Device } = global;

exports.addDevice = (deviceParam) => {
  const {
    userId,
    deviceId,
    deviceType,
    deviceToken,
    expiredDate,
  } = deviceParam;

  const device = new Device({
    user: userId,
    device_id: deviceId,
    device_type: deviceType,
    device_token: deviceToken,
    expired_at: expiredDate,
  });

  return device.save();
};


exports.findAndUpdateDevice =
  (userId, updateData, options) => Device.findOneAndUpdate({ user: userId }, updateData, options);

exports.findDeviceByUserId = userId => Device.findOne({ user: userId });

exports.saveDevice = device => device.save();

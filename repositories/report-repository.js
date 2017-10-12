const Report = require('../models/report');

exports.saveReport = (reportData) => {
  const report = new Report(reportData);
  return report.save();
};

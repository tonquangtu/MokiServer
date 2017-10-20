const { Report } = global;

exports.saveReport = (reportData) => {
  const report = new Report(reportData);
  return report.save();
};

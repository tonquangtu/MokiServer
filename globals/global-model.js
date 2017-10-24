const Block = require('../models/block');
const Brand = require('../models/brand');
const Campaign = require('../models/campaign');
const Category = require('../models/category');
const Country = require('../models/country');
const Like = require('../models/like');
const Notification = require('../models/notificartion');
const Product = require('../models/product');
const Report = require('../models/report');
const SearchHistory = require('../models/search-history');
const Size = require('../models/size');
const User = require('../models/user');
const UserSetting = require('../models/user-setting');
const Conversation = require('../models/conversation');
const Message = require('../models/message');


exports.initGlobalModels = () => {
  global.Block = Block;
  global.Brand = Brand;
  global.Campaign = Campaign;
  global.Category = Category;
  global.Country = Country;
  global.Like = Like;
  global.Notification = Notification;
  global.Product = Product;
  global.Report = Report;
  global.SearchHistory = SearchHistory;
  global.Size = Size;
  global.User = User;
  global.UserSetting = UserSetting;
  global.Conversation = Conversation;
  global.Message = Message;
};

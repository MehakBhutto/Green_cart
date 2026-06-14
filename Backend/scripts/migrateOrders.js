const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/products');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/green_cart');
  console.log('Connected to MongoDB');

  const orders = await Order.find();
  console.log(`Found ${orders.length} orders`);

  let updated = 0;
  for (const order of orders) {
    let changed = false;
    for (const item of order.products) {
      // If already an ObjectId reference, skip
      const prod = item.product;

      // If it's an object with _id
      if (prod && typeof prod === 'object' && prod._id) {
        const id = (typeof prod._id === 'string') ? prod._id : prod._id.toString();
        item.product = mongoose.Types.ObjectId(id);
        changed = true;
        continue;
      }

      // If it's a string that looks like an ObjectId
      if (typeof prod === 'string' && /^[0-9a-fA-F]{24}$/.test(prod)) {
        item.product = mongoose.Types.ObjectId(prod);
        changed = true;
        continue;
      }

      // If it's an object with a name, try to find product by name
      if (prod && typeof prod === 'object' && prod.name) {
        const found = await Product.findOne({ name: prod.name }).select('_id');
        if (found) {
          item.product = found._id;
          changed = true;
          continue;
        }
      }

      // If it has 'name' field at top-level of item (legacy), try that
      if (!prod && item.name) {
        const found = await Product.findOne({ name: item.name }).select('_id');
        if (found) {
          item.product = found._id;
          changed = true;
          continue;
        }
      }

      // otherwise leave as-is
    }

    if (changed) {
      await order.save();
      updated++;
      console.log(`Updated order ${order._id}`);
    }
  }

  console.log(`Migration complete. Orders updated: ${updated}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

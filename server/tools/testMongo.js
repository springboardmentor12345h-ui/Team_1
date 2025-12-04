const mongoose = require('mongoose');

(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in environment');
    process.exit(2);
  }
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    const { host, port, name } = conn.connection;
    console.log('Atlas connection OK');
    console.log(`Connected to: host=${host} port=${port} db=${name}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Atlas connection FAILED');
    console.error(err.message);
    process.exit(1);
  }
})();

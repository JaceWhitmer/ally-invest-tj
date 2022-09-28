const connectMongo = require("../auth/mongoose");
const Entry = require("../../../models/entry");

export default async function entry(req, res) {
  //   const { formValues } = req.body;
  console.log(req.body);
  await connectMongo();

  const entry = await Entry.default.create(req.body);

  res.status(200).json({ message: entry });
}

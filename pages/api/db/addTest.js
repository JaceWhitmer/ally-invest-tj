const connectMongo = require("../auth/mongoose");
const Test = require("../../../models/test");

export default async function addTest(req, res) {
  const { date, comment } = req.body;
  console.log(req.body);

  await connectMongo();

  const test = await Test.default.create(req.body);

  res.json(req.body);
  //   res.status(200).json({ date: new Date(), comment: "This is a comment" });
}

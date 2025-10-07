import type { NextApiRequest, NextApiResponse } from "next";
import { initialTimesheets } from "../../../data/timesheets";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(initialTimesheets);
}

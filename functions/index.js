import { onRequest } from "firebase-functions/v2/https";
import { gradeHandler } from "./grade.js";
import { gradeEssayHandler } from "./gradeEssay.js";
import { canvaHandler } from "./canva.js";

const opts = {
  region: "asia-southeast1",
  cors: false,
  maxInstances: 10,
};

export const grade = onRequest({ ...opts, timeoutSeconds: 120 }, gradeHandler);
export const gradeEssay = onRequest({ ...opts, timeoutSeconds: 120 }, gradeEssayHandler);
export const canva = onRequest({ ...opts, timeoutSeconds: 30 }, canvaHandler);

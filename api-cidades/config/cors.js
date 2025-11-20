import cors from "cors";

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 204,
  credentials: true,
};

export default cors(corsOptions);

import { cronJobs } from "convex/server"

const crons = cronJobs()

// All GitHub sync crons have been removed since plans now live in Convex

export default crons

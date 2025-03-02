import { Router } from "express";
import { addJob, getAllJobs, searchJob, updateJob } from "./job.service.js";
import { authentication, authorization } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addJobSchema, updateJobSchema } from "./job.validation.js";
const jobRouter = Router();

jobRouter.post('/job/:companyId',authentication,validation(addJobSchema),addJob)

jobRouter.patch('/updateJob/:jobId',authentication,validation(updateJobSchema),updateJob)

jobRouter.get('/getJob/:companyId',authentication,searchJob)

jobRouter.get('/getAllJobs',authentication, getAllJobs)
export default jobRouter;
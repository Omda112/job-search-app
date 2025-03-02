import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { authentication } from "../../middleware/auth.js";
import { addCompany, deleteCompanyCover, deleteCompanyLogo, searchCompany, softDeleteCompany, updateCompany, uploadCompanyCover, uploadCompanyLogo } from "./company.service.js";
import { addCompanySchema, searchByNameSchema, updateCompanySchema } from "./company.validation.js";
import { fileTypes, multerHost } from "../../middleware/multer.js";
const companyRouter = Router();

companyRouter.post('/addCompany',authentication,validation(addCompanySchema),addCompany);

companyRouter.patch('/updateCompany/:id',authentication,validation(updateCompanySchema),updateCompany);

companyRouter.delete('/deleteCompany/:id',authentication,softDeleteCompany);

companyRouter.get('/searchWithName',authentication,validation(searchByNameSchema),searchCompany)

companyRouter.patch("/:id/uploadLogo",authentication, multerHost(fileTypes.image).single("logo"),uploadCompanyLogo);

companyRouter.patch("/:id/uploadCoverPic",authentication, multerHost(fileTypes.image).single("coverPic"),uploadCompanyCover);

companyRouter.delete("/:id/deleteLogo",authentication,deleteCompanyLogo)

companyRouter.delete("/:id/deleteCover",authentication,deleteCompanyCover)
export default companyRouter;
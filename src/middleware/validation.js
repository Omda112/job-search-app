export const validation = (schema) => {
    return (req, res, next) => {
        const inputData = { 
            ...req.body, 
            ...req.query, 
            ...req.params,
        };

        console.log("Input Data:", inputData);
        
        
        const validateSchema = schema.validate(inputData, { abortEarly: false });

        if (validateSchema?.error) {
            return res.status(400).json({
                msg: "Validation Error",
                errors: validateSchema.error.details
            });
        }

        next();
    };
};




// export const validation = (schema) => {
//     return (req, res, next) => {
//        console.log(schema);
       
//         const inputData = { ...req.body, ...req.query , ...req.params , ...req.file}
//         console.log(inputData);
//         const validateSchema = schema.validate(inputData, { abortEarly: false });

//             if (validateSchema?.error) {
//                 return res.status(400).json({ message: "invalid validation error", error: validateSchema?.error.details});
//             }

//         next();
//     };
// };

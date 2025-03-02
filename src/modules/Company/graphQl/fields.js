import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { company } from "./type.js";
import { approvedByAdmin, banCompanyQuery, getAllCompanie, unbanCompanyQuery } from "./resolve.js";
import { authorization } from "../../../middleware/auth.js";

export const companyQuery = {
    getAllCompanies: {
        type: new GraphQLList(company),
        resolve: getAllCompanie
    }
};

export const companyMutation = {
    banCompany: {
        type: company,
        args: { id: { type: GraphQLID } },
        resolve: banCompanyQuery
    },
    unbanCompany: {
        type: company,
        args: { id: { type: GraphQLID } },
        resolve: unbanCompanyQuery
    },
    approvedByAdmin: {
        type: company,
        args: { 
            id: { type: new GraphQLNonNull(GraphQLID) }, 
            authorization: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: approvedByAdmin
    }
    
};

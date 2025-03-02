import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { userMutation, userQuery } from "./Users/graphQl/fields.js";
import { companyQuery, companyMutation } from "./Company/graphQl/fields.js";

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            ...userQuery,
            ...companyQuery
        }
    }),
    mutation: new GraphQLObjectType({
        name: "Mutation",
        fields: {
            ...companyMutation,
            ...userMutation
        }
    })
});

import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLInt } from "graphql";

export const company = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: { type: GraphQLID },
        companyName: { type: GraphQLString },
        description: { type: GraphQLString },
        industry: { type: GraphQLString },
        address: { type: GraphQLString },
        numberOfEmployees: { type: GraphQLInt },
        companyEmail: { type: GraphQLString },
        createdBy: { type: GraphQLID },
        logo: { 
            type: GraphQLString, 
            resolve: (parent) => parent.logo?.secure_url
        },  
        coverPic: { 
            type: GraphQLString, 
            resolve: (parent) => parent.coverPic?.secure_url
        },  
        legalAttachment: { 
            type: GraphQLString, 
            resolve: (parent) => parent.legalAttachment?.secure_url
        },
        approvedByAdmin: { type: GraphQLBoolean },
        createdAt: { 
            type: GraphQLString,
            resolve: (parent) => parent.createdAt?.toISOString()
        },
        updatedAt: { 
            type: GraphQLString,
            resolve: (parent) => parent.updatedAt?.toISOString()
        },
        bannedAt: { 
            type: GraphQLString, 
            resolve: (parent) => parent.bannedAt ? parent.bannedAt.toISOString() : null
        },
    }),
});

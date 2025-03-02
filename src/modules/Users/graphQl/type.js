import { GraphQLObjectType, GraphQLID, GraphQLString } from "graphql";

export const user = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        firstName: { 
            type: GraphQLString,
            resolve: (parent) => parent.name?.first
        },
        lastName: { 
            type: GraphQLString,
            resolve: (parent) => parent.name?.last
        },
        phoneNumber: { 
            type: GraphQLString,
            resolve: (parent) => parent.phone 
        },
        gender: { type: GraphQLString },
        dateOfBirth: { 
            type: GraphQLString,
            resolve: (parent) => parent.DOB?.toISOString()
        },
        createdAt: { 
            type: GraphQLString,
            resolve: (parent) => parent.createdAt?.toISOString()
        },
        updatedAt: { 
            type: GraphQLString,
            resolve: (parent) => parent.updatedAt?.toISOString()
        },
        isBanned: { type: GraphQLString}
    }),
});

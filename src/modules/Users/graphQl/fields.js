import { bannUser, getAllUser, unbannUser } from "./resolve.js";
import { user } from "./type.js";
import { GraphQLID, GraphQLList } from "graphql";


export const userQuery = {
    getAllUsers: {
        type: new GraphQLList(user),
        resolve: getAllUser
    }
};

export const userMutation = {
    bannUser: {
        type: user,
        args: {
            id: { type: GraphQLID }
        },
        resolve: bannUser
    },
    unbannUser: {
        type: user,
        args: {
            id: { type: GraphQLID }
        },
        resolve: unbannUser
    }
};

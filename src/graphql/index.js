import Vue from "vue";
import { ApolloClient } from "apollo-client";
import { createUploadLink } from "apollo-upload-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import VueApollo from "vue-apollo";

Vue.use(VueApollo);

const cache = new InMemoryCache({
	addTypename: true,
	dataIdFromObject: ({ id }) => id
});

const link = createUploadLink({
	uri: `${process.env.API_URL}/graphql`,
	credentials: "include"
});

const client = new ApolloClient({
	link,
	cache
});

export default new VueApollo({
	defaultClient: client
});

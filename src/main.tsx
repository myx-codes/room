import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
import App from "./App.tsx";
import { apolloClient } from "./lib/apolloClient";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<ApolloProvider client={apolloClient}>
		<App />
	</ApolloProvider>
);

# About

Vue JSON:API is meant to be a painless integration with well formatted APIs. It is designed to facilitate work with api, help maintain a clean, consistent and readable code base, and speed up development. Some features will be helpful in providing a good experience for users.

Many patterns and usage may seem familiar to you, as this solution is strongly inspired by [VueApollo](https://github.com/vuejs/vue-apollo).


## What is JSON:API?

JSON:API is a specification for building APIs in json.

"By following shared conventions, you can increase productivity, take advantage of generalized tooling, and focus on what matters: your application."

[Read more on official website.](https://jsonapi.org/)

## Features

### Data normalization

Instead of accessing raw JSON:API responses you will use simple normalized data objects.

See [Normalized Data](/guide/normalization.html) chapter.

### Declarative data fetching

Declare in component what resources you need and don't worry about all the things related to the call.

### Auto updates

Resources are shared and reused so any record changes are propagated to all places where given record is used. You can forget about updating the UI or refetching the queries.

### Fetch policies

Make use of already fetched data using fetch policies. Easily specify how you want your component to interact with the cache.

### And much more...

While reading this manual, you will certainly discover many other interesting features of this integration. Have fun!

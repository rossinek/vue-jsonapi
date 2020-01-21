# Normalized Data

Using Vue JSON:API you will probably never have to use raw data from api response. Instead you will be using simple normalized data objects.

I assume that you already know how the api response should be formatted according to the [JSON:API specification](/guide/#what-is-json-api).

This is example response from api (example comes from [official JSON:API website](https://jsonapi.org/)):

```json
{
  "links": {
    "self": "http://example.com/articles",
    "next": "http://example.com/articles?page[offset]=2",
    "last": "http://example.com/articles?page[offset]=10"
  },
  "data": [{
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API paints my bikeshed!"
    },
    "relationships": {
      "author": {
        "links": {
          "self": "http://example.com/articles/1/relationships/author",
          "related": "http://example.com/articles/1/author"
        },
        "data": { "type": "people", "id": "9" }
      },
      "comments": {
        "links": {
          "self": "http://example.com/articles/1/relationships/comments",
          "related": "http://example.com/articles/1/comments"
        },
        "data": [
          { "type": "comments", "id": "5" },
          { "type": "comments", "id": "12" }
        ]
      }
    },
    "links": {
      "self": "http://example.com/articles/1"
    }
  }],
  "included": [{
    "type": "people",
    "id": "9",
    "attributes": {
      "firstName": "Dan",
      "lastName": "Gebhardt",
      "twitter": "dgeb"
    },
    "links": {
      "self": "http://example.com/people/9"
    }
  }, {
    "type": "comments",
    "id": "5",
    "attributes": {
      "body": "First!"
    },
    "relationships": {
      "author": {
        "data": { "type": "people", "id": "2" }
      }
    },
    "links": {
      "self": "http://example.com/comments/5"
    }
  }, {
    "type": "comments",
    "id": "12",
    "attributes": {
      "body": "I like XML better"
    },
    "relationships": {
      "author": {
        "data": { "type": "people", "id": "9" }
      }
    },
    "links": {
      "self": "http://example.com/comments/12"
    }
  }]
}
```

Normalized response looks like this:

```js
{
  __type: 'articles',
  id: '1',
  title: 'JSON:API paints my bikeshed!',
  author: {
    __type: 'people',
    id: '9',
    firstName: 'Dan',
    lastName: 'Gebhardt',
    twitter: 'dgeb',
  },
  comments: [
    {
      __type: 'comments',
      id: '5',
      body: 'First!',
    },
    {
      __type: 'comments',
      id: '12',
      body: 'I like XML better',
      author: {
        __type: 'people',
        id: '9',
        firstName: 'Dan',
        lastName: 'Gebhardt',
        twitter: 'dgeb',
      },
    },
  ],
}
```

You may wonder if it is a good idea that the same records are repeated in this object, but in practice, each of the records is kept in the cache exactly once and the relations are implemented as getters reading the value from the cache. Actually this normalized resource looks like this:

```js
{
  __type: 'articles',
  id: '1',
  title: 'JSON:API paints my bikeshed!',
  get author () {
    return readRecord({ type: 'people', id: '9' })
  },
  get comments () {
    return [
      readRecord({ type: 'comments', id: '5' }),
      readRecord({ type: 'comments', id: '12' }),
    ]
  },
}
```

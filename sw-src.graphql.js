importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js')
importScripts('https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval-iife.min.js')

var CACHE_NAME = 'main-cache-v1'
var urlsToCache = [
  // '/index.html',
]

// Init indexedDB using idb-keyval, https://github.com/jakearchibald/idb-keyval
const store = new idbKeyval.Store('GraphQL-Cache', 'PostResponses')

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`)
} else {
  console.log(`Boo! Workbox didn't load 😬`)
}

// Workbox with custom handler to use IndexedDB for cache.
workbox.routing.registerRoute(
  new RegExp('/graphql(/)?'),
  // Uncomment below to see the error thrown from Cache Storage API.
  //workbox.strategies.staleWhileRevalidate(),
  async ({
    event
  }) => {
    return staleWhileRevalidate(event)
  },
  'POST'
)

/*
// When installing SW.
self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});
*/

// Return cached response when possible, and fetch new results from server in
// the background and update the cache.
self.addEventListener('fetch', async (event) => {
  if (event.request.method === 'POST') {
    event.respondWith(staleWhileRevalidate(event))
  }

  // TODO: Handles other types of requests.
})

async function staleWhileRevalidate (event) {
  const cachedResponse = await getCache(event.request.clone())
  const fetchPromise = fetch(event.request.clone())
    .then((response) => {
      setCache(event.request.clone(), response.clone())
      return response
    })
    .catch((err) => {
      console.error(err)
    });
  return cachedResponse ? Promise.resolve(cachedResponse) : fetchPromise
}

async function serializeResponse (response) {
  let serializedHeaders = {}

  for (var entry of response.headers.entries()) {
    serializedHeaders[entry[0]] = entry[1]
  }

  const serialized = {
    headers: serializedHeaders,
    status: response.status,
    statusText: response.statusText
  }

  serialized.body = await response.json()
  return serialized
}

async function setCache (request, response) {
  const body = await request.json()
  const id = CryptoJS.MD5(body.query).toString()

  var entry = {
    query: body.query,
    response: await serializeResponse(response),
    timestamp: Date.now()
  }
  idbKeyval.set(id, entry, store)
}

async function getCache (request) {
  let data
  try {
    const body = await request.json()
    const id = CryptoJS.MD5(body.query).toString()
    data = await idbKeyval.get(id, store)
    if (!data) return null

    // Check cache max age.
    const cacheControl = request.headers.get('Cache-Control')
    const maxAge = cacheControl ? parseInt(cacheControl.split('=')[1]) : 3600
    if (Date.now() - data.timestamp > maxAge * 1000) {
      console.log(`Cache expired. Load from API endpoint.`)
      return null
    }

    console.log(`Load response from cache.`);
    return new Response(JSON.stringify(data.response.body), data.response)
  } catch (err) {
    return null
  }
}

async function getPostKey (request) {
  const body = await request.json()
  return JSON.stringify(body)
}

workbox.precaching.precacheAndRoute(self.__precacheManifest)

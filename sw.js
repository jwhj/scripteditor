var cacheName="qa"
var cacheFiles=[
	'vue.min.js',
	'TSCu_Comic.ttf',
	'DejaVuSansMono.ttf',
	'codemirror/lib/codemirror.css',
	'codemirror/theme/monokai.css',
	'codemirror/lib/codemirror.js',
	'codemirror/mode/javascript/javascript.js',
	'codemirror/mode/python/python.js'
]
self.addEventListener('install',e=>{
	var cachePromise=caches.open(cacheName).then(cache=>{
		cache.addAll(cacheFiles)
	})
	e.waitUntil(cachePromise)
	self.skipWaiting()
})
self.addEventListener('fetch',e=>{
	e.respondWith(
		caches.match(e.request).then(cache=>{
			return cache || fetch(e.request)
		}).catch(err=>{
			console.log(err)
			return fetch(e.request)
		})
	)
})
self.addEventListener('activate',e=>{
	var cachePromise=caches.keys().then(keys=>{
		return Promise.all(keys.map(key=>{
			if (key!=cacheName){
				return caches.delete(key)
			}
		}))
	})
	e.waitUntil(cachePromise)
	return self.clients.claim()
})

function wait(delay, value) {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), delay)
  })
}

function* asyncFunction() {
  const numbers = yield wait(1000, [1, 2, 3])
  const doubles = yield wait(1000, numbers.map(n => n * 2))
  return doubles
}

function co(gen) {
  gen = gen()

  return new Promise((resolve, reject) => {
    success()

    function success(r) {
      try {
        const result = gen.next(r)
        next(result)
      } catch (e) {
        reject(e)
      }
    }

    function error(e) {
      try {
        const result = gen.throw(r)
        next(result)
      } catch (e) {
        reject(e)
      }
    }

    function next(res) {
      if (!res.done) {
        res.value.then(success, error)
      } else {
        resolve(res.value)
      }
    }
  });
}

co(asyncFunction).then((result) => {
  console.log('result: ', result)
}, (error) => {
  console.log('error: ', error)
});

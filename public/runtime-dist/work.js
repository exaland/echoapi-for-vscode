global.IS_ECHOAPI = true;

const path = require('path');
const { parentPort } = require('worker_threads');
const { run, request2HAR } = require(path.join(__dirname, 'runtime', 'index.js'));

// Promise Queue
class PromiseQueue {
  queue = Promise.resolve(true);

  add(operation) {
    return new Promise((resolve, reject) => {
      this.queue = this.queue.then(operation).then(resolve).catch(reject);
    });
  }
  get() {
    return this.queue;
  }
}

const runPromise = (option, events) => {
  return new Promise(async (resolve, reject) => {
    try {
      await run(events, option, (res) => {
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
};

// 定义可在工作线程中调用的方法
const methods = {
  httpSend: async (option, test_events) => {
    let res = await runPromise(option, test_events);
    return JSON.stringify(res);
  },
  runnerEvent: async (option, test_events, emitRuntimeEvent) => {
    await run(test_events, option, emitRuntimeEvent);
  },
  httpHar: async (option, test_events) => {
    const result = await request2HAR(test_events, option);
    if (result) {
      return result;
    } else {
      return null;
    }
  },
};

// 监听来自主线程的消息
parentPort.on('message', async (message) => {
  const { method, args } = message;
  // 检查方法是否存在
  if (methods[method]) {
    try {
      if (method === 'runnerEvent') {
        const enqueue = new PromiseQueue();
        await methods[method](...args, (msg) => {
          enqueue.add(async () => {
            if (typeof msg == "string") {
              parentPort.postMessage(msg);
            } else {
              parentPort.postMessage(JSON.stringify(msg));
            }
          });
        });
        await enqueue.get();
        return;
      }
      const result = await methods[method](...args);
      parentPort.postMessage(result);
    } catch (error) {
      parentPort.postMessage(error.message);
    }
    // 调用方法并将结果发送回主线程
  } else {
    // 处理未知方法的情况
    parentPort.postMessage(`Unknown method: ${method}`);
  }
});
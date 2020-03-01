---
title: "[译]如何使用React Hooks获取数据?"
tags: [Javascript, React]
archives_title: Archives
categories: Javascript
date: 2019-03-14
---

> 原文链接: [How to fetch data with React Hooks?](https://www.robinwieruch.de/react-hooks-fetch-data/)
> 原文作者: [RWieruch](https://www.robinwieruch.de/)

在这篇教程中，我们会让你明白如何通过[state](https://reactjs.org/docs/hooks-state.html)和[effect](https://reactjs.org/docs/hooks-effect.html)这两个 hooks 来`获取数据`。我们会使用广为人知的[Hacker News API](https://hn.algolia.com/api)来获取科技世界的流行文章。你也可以实现你的`custom hook(自定义钩子)`,它可以在你的应用程序任何地方复用，或者发布到 npm 上作为一个独立的 npm 包。

如果你不知道这些 React 新特性，你也可以阅读[introduction to React Hooks](https://www.robinwieruch.de/react-hooks/)这篇文章。如果你想查看这个项目代码，点击这个[Github 仓库](https://github.com/the-road-to-learn-react/react-hooks-introduction)的链接。

**NOTE**: 在未来，React Hooks 不适合用于在 React 中获取数据。取而代之的是一个叫 Suspense 的新特性。尽管如此，文章以下内容仍然对于学习关于 state 跟 effect hooks 有帮助。

# 使用 React Hooks 获取数据

如果你对 React 获取数据不熟悉，可以阅读[extensive data fetching in React article](https://www.robinwieruch.de/react-fetching-data/)，它会告诉你如何通过 React 的 class component 来获取数据、怎样使用[Render Props 组件](https://www.robinwieruch.de/react-render-props-pattern/)和[高阶组件](https://www.robinwieruch.de/gentle-introduction-higher-order-components/)来实现复用，还有它是怎样解决错误处理和加载 spinner 的。在这篇文章，我们会给你展示如何在函数式组件(functional component)中使用 React Hooks 来实现上述内容。

```js
import React, { useState } from "react";

function App() {
  const [data, setData] = useState({ hits: [] });

  return (
    <ul>
      {data.hits.map(item => (
        <li key={item.objectID}>
          <a href={item.url}>{item.title}</a>
        </li>
      ))}
    </ul>
  );
}

export default App;
```

App 组件展示了一个 items 列表(hits = Hacker News 文章)。状态和状态更新的函数来源于叫做`useState`的状态钩子，它负责管理我们将为 App 组件获取的数据的本地状态。表示 data 的初始状态是一个对象里面属性名为 hits 的空数组，目前没有任何人为 data 设置任何状态(state)。

我们将使用[axios](https://github.com/axios/axios)来获取数据，但至于是否使用其他获取数据的库或者浏览器原生的 fetch API 将由你来决定。如果你没有安装 axios，你可以在命令行输入`npm install axios`，然后使用 effect hooks 来实现数据获取。

```js
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({ hits: [] });

  useEffect(async () => {
    const result = await axios(
      "http://hn.algolia.com/api/v1/search?query=redux"
    );

    setData(result.data);
  });

  return (
    <ul>
      {data.hits.map(item => (
        <li key={item.objectID}>
          <a href={item.url}>{item.title}</a>
        </li>
      ))}
    </ul>
  );
}

export default App;
```

名为 useEffect 的 effect hook，用于使用 axios 从 API 获取数据，并且使用 state hook 的更新函数(setData)把数据存放到组件内的本地 state。Promise resolving 会在 aysnc/await 中进行。

然而，当你运行你的应用程序时，你会陷入一个恶性循环。组件挂载(mount)的时候 effect hook 会运行，但组件更新(update)的时候会再次运行。它将一次又一次地获取数据。这是一个 bug 并且需要预防。**我们只需要在组件挂载的时候获取数据。**这就是为什么可以使用一个空数组作为 effect hook 的第二个参数，来避免组件更新的时候激活它，并且只在组件挂载的时候激活它的原因。

```js
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({ hits: [] });

  useEffect(async () => {
    const result = await axios(
      "http://hn.algolia.com/api/v1/search?query=redux"
    );

    setData(result.data);
  }, []);

  return (
    <ul>
      {data.hits.map(item => (
        <li key={item.objectID}>
          <a href={item.url}>{item.title}</a>
        </li>
      ))}
    </ul>
  );
}

export default App;
```

第二个参数可以定义 hook 依赖的所有变量(在这个数组中分配)。如果其中一个参数改变，hook 会再次运行。如果数组内的变量为空，组件更新的时候 hook 不会运行，因为它不会去监听任何变量的变化。

还有最后一个问题。在代码中，我们使用 async/await 从第三方 API 获取数据。根据文档的描述，每一个使用 async 的函数注解都应该返回一个隐式 promise。*"async 函数声明定义一个异步函数，它返回一个 AsyncFunction 对象。异步函数是通过事件循环(event loop)异步操作的函数,它使用隐式 promise 返回结果。"*然而，一个 effect hook 它应该不返回任何东西或者返回一个简洁的函数。这就是为什么你会看到在开发者模式会有如下的 console log:**07:41:22.910 index.js:1452 Warning: useEffect function must return a cleanup function or nothing. Promises and useEffect(async () => …) are not supported, but you can call an async function inside an effect.**。这就是为什么不允许直接在`useEffect`里面使用 async 函数的原因。我们换种方式在 effect hook 中使用 async 函数。

```js
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({ hits: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        "http://hn.algolia.com/api/v1/search?query=redux"
      );

      setData(result.data);
    };

    fetchData();
  }, []);

  return (
    <ul>
      {data.hits.map(item => (
        <li key={item.objectID}>
          <a href={item.url}>{item.title}</a>
        </li>
      ))}
    </ul>
  );
}

export default App;
```

简单来说，就是使用 React Hooks 获取数据。如果你对错误处理、加载指示、如何触发表单数据获取，以及如何实现可复用的数据获取 hook 这些内容感兴趣，请继续阅读文章。

# 如何以编程的方式/手动地触发 hook

太棒了，一旦组件挂载后，我们就可以获取到数据了。但是，如果我们输入某个字段来告诉 API 我们对哪个话题感兴趣呢？将"Redux"作为默认查询(query)，但关于"React"的话题呢？让我们来实现一个 input 元素(element)来使得某人可以获取除了"Redux"之外的话题的相关数据。

```js
import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState("redux");

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        "http://hn.algolia.com/api/v1/search?query=redux"
      );

      setData(result.data);
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

export default App;
```

此时，两个状态(state)是彼此独立的，但现在你希望将它们耦合起来，只通过输入字段指定的查询(query)来获取数据。通过以下修改，组件会在挂载后按照查询(query)获取所有相关文章。

```js
function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `http://hn.algolia.com/api/v1/search?query=${query}`,
      );

      setData(result.data);
    };

    fetchData();
  }, []);

  return (
    ...
  );
}

export default App;
```

此时我们会发现少了一样东西: 当你尝试在在输入框输入一些东西的时候，你会发现，在组件挂载后触发的 effect hook 获取了数据之后，就不会再获取数据了。这是因为你在 effect hook 的把一个空数组作为第二个参数，而 effect hook 没有依赖的变量，所以它只在组件挂载的时候触发。然而，现在的 effect hook 需要依赖查询(query)。一旦查询(query)改变，数据请求应该再次触发。

```js
function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `http://hn.algolia.com/api/v1/search?query=${query}`,
      );

      setData(result.data);
    };

    fetchData();
  }, [query]);

  return (
    ...
  );
}

export default App;
```

一旦你改变了输入框里面的值，数据就会重新获取。但这会引发另一个问题: 每输入一个字符都会触发数据获取请求。不如提供一个按钮，来手动触发 hook?

```js
function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState("redux");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `http://hn.algolia.com/api/v1/search?query=${query}`
      );

      setData(result.data);
    };

    fetchData();
  }, [query]);

  return (
    <Fragment>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <button type="button" onClick={() => setSearch(query)}>
        Search
      </button>

      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}
```

现在，我们使 effect hook 依赖于搜索(search)的状态，而不是每次输入都波动地改变查询(query)的状态。一旦用户点击了按钮，新的搜索(search)状态会被设置，并手动触发了 effect hook。

```js
function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');
  const [search, setSearch] = useState('redux');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `http://hn.algolia.com/api/v1/search?query=${search}`,
      );

      setData(result.data);
    };

    fetchData();
  }, [search]);

  return (
    ...
  );
}

export default App;
```

此外，搜索(search)状态的初始值会被设置为与查询(query)状态相同的状态，因为组件也在挂载时获取数据，因此结果应该与输入框的值对应。然而，具有相似的查询(query)和搜索(search)状态会令人困惑。为何不把实际的 URL 设置为状态而不是设置为搜索(search)状态？

```js
function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState("redux");
  const [url, setUrl] = useState(
    "http://hn.algolia.com/api/v1/search?query=redux"
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(url);

      setData(result.data);
    };

    fetchData();
  }, [url]);

  return (
    <Fragment>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <button
        type="button"
        onClick={() =>
          setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`)
        }
      >
        Search
      </button>

      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}
```

这是使用 effect hook 来获取隐式程序数据的情况。你可以决定 effect hook 取决于哪个状态。一旦你在点击或者在其他副作用的情况下设置状态，effect hook 会重新运行。在这种情况下，如果 URL 状态改变了，effect hook 会重新从 API 请求数据。

# 使用 React Hooks 实现加载指示器

让我们为数据获取请求引入一个加载指示器。它只是另一个由 state hook 管理的状态。loading 标志用于在 App 组件中呈现加载指示器。

```js
import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState("redux");
  const [url, setUrl] = useState(
    "http://hn.algolia.com/api/v1/search?query=redux"
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const result = await axios(url);

      setData(result.data);
      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  return (
    <Fragment>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <button
        type="button"
        onClick={() =>
          setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`)
        }
      >
        Search
      </button>

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {data.hits.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}

export default App;
```

在组件挂载或者 URL 状态改变的时候，一旦 effect hook 调用数据获取方法，加载(loading)状态就会被设置为 true。一旦请求完成，加载(loading)状态就会被再次设置为 false。

# 使用 React Hooks 进行错误处理

那如何使用一个 React Hook 来进行数据获取时的错误处理？错误只是 state hook 的另一种初始状态。一旦错误(error)状态存在，App 组件会给用户渲染一个错误的反馈。当使用 async/await 的时候，通常使用 try/catch 块进行错误处理。你也可以在 effect hook 里面使用:

```js
import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState("redux");
  const [url, setUrl] = useState(
    "http://hn.algolia.com/api/v1/search?query=redux"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios(url);

        setData(result.data);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  return (
    <Fragment>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <button
        type="button"
        onClick={() =>
          setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`)
        }
      >
        Search
      </button>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {data.hits.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}

export default App;
```

effect hook 每次运行的时候，错误(error)状态都会被重设一遍。这是非常有用的，因为在请求失败的时候，用户可能想要再次尝试获取，这时候应该重置错误。为了强制实现出错的情况，你可以把 URL 修改为一些无效的内容，然后检查一下错误信息是否成功显示。

# 使用表单和 React 获取数据

如何使用合适的表单来获取数据？到目前为止，我们有输入框和按钮的组合。一旦引入更多的输入元素，你可能会想要用表单元素来包裹它们。此外，表单还可以触发键盘上的"Enter"来触发按钮。

```js
function App() {
  ...

  return (
    <Fragment>
      <form
        onSubmit={() =>
          setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`)
        }
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      ...
    </Fragment>
  );
}
```

但是现在点击提交按钮的时候，浏览器会重新加载，因为这是提交表单时浏览器的固有行为。为了防止这种默认行为，我们可以在 React 事件中调用一个函数。在 React 的 class component 也是这样实现的。

```js
function App() {
  ...

  const doFetch = () => {
    setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`);
  };

  return (
    <Fragment>
      <form onSubmit={event => {
        doFetch();

        event.preventDefault();
      }}>
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      ...
    </Fragment>
  );
}
```

现在，当你点击提交按钮的时候，浏览器也不会重新加载了。它和以前一样，但这次使用的是表单而不是原来的输入框和按钮的组合。你也可以在键盘上按上"Enter"触发。

# 自定义一个数据获取 hook

为了抽离一个数据获取的自定义 hook，将属于数据获取的所有内容，除了属于输入框的查询(query)状态，但包括加载指示器和错误处理的，移动到它自己的函数里。还要确保从 App 组件中使用函数返回所有必要的变量。

```js
const useHackerNewsApi = () => {
  const [data, setData] = useState({ hits: [] });
  const [url, setUrl] = useState(
    "http://hn.algolia.com/api/v1/search?query=redux"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios(url);

        setData(result.data);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  const doFetch = () => {
    setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`);
  };

  return { data, isLoading, isError, doFetch };
};
```

现在，一个全新的 hook 可以再次在 App 组建中使用。

```js
function App() {
  const [query, setQuery] = useState("redux");
  const { data, isLoading, isError, doFetch } = useHackerNewsApi();

  return <Fragment>...</Fragment>;
}
```

接着，从`doFetch`函数外部传入 URL 状态:

```js
const useHackerNewsApi = () => {
  ...

  useEffect(
    ...
  );

  const doFetch = url => {
    setUrl(url);
  };

  return { data, isLoading, isError, doFetch };
};

function App() {
  const [query, setQuery] = useState('redux');
  const { data, isLoading, isError, doFetch } = useHackerNewsApi();

  return (
    <Fragment>
      <form
        onSubmit={event => {
          doFetch(
            `http://hn.algolia.com/api/v1/search?query=${query}`,
          );

          event.preventDefault();
        }}
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      ...
    </Fragment>
  );
}
```

初始状态也可以是通用的。简单地把它传递到新的自定义 hook:

```js
import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";

const useDataApi = (initialUrl, initialData) => {
  const [data, setData] = useState(initialData);
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios(url);

        setData(result.data);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  const doFetch = url => {
    setUrl(url);
  };

  return { data, isLoading, isError, doFetch };
};

function App() {
  const [query, setQuery] = useState("redux");
  const {
    data,
    isLoading,
    isError,
    doFetch
  } = useDataApi("http://hn.algolia.com/api/v1/search?query=redux", {
    hits: []
  });

  return (
    <Fragment>
      <form
        onSubmit={event => {
          doFetch(`http://hn.algolia.com/api/v1/search?query=${query}`);

          event.preventDefault();
        }}
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {data.hits.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}

export default App;
```

这就是使用自定义 hook 获取数据的原因。hook 本身不知道任何跟 API 相关的内容。它接收外部的所有参数，并且只管理必要的状态，比如数据(data)、加载(loading)、错误(error)状态。它将执行请求，并且给组件返回数据。

# 使用 Reducer Hook 请求数据

到目前为止，我们已经使用了各种 state hook 来管理获取到的数据 - 数据(data)、加载(loading)和错误(error)状态。然而，不知何故，所有的这些状态都是由它们自身的 state hook 管理的，并且联系在一起，因为它们关心的是同样的问题。如你所见，它们都是在数据获取函数中使用的。能表明它们联系在一起的表现是它们是一个接一个地使用的(比如: `setIsError`, `setIsLoading`)。让我们把这三个用 Reducer Hook 结合起来。

Reducer Hook 返回一个状态(state)对象和一个修改状态(state)对象的函数。这个叫做 dispatch 的函数，带有一个含有类型(type)跟可选的载荷(payload)的动作(action)。所有的这些信息，在实际的 reducer 函数中使用 action 中的可选载荷(payload)和类型(type)，实现从以前的状态(state)提取一个全新的状态(state)的动作。让我们来看看这在代码中是如何工作的:

```js
import React, {
  Fragment,
  useState,
  useEffect,
  useReducer,
} from 'react';
import axios from 'axios';

const dataFetchReducer = (state, action) => {
  ...
};

const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  ...
};
```

Reducer Hook 将 reducer 函数和初始状态对象作为参数。在我们的例子中，数据(data)、加载(loading)和错误(error)状态的初始状态没有发生改变，但它们被聚合到一个由 reducer hook 管理的状态对象，而不是单独的一个 state hook。

```js
const dataFetchReducer = (state, action) => {
  ...
};

const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const result = await axios(url);

        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE' });
      }
    };

    fetchData();
  }, [url]);

  ...
};
```

现在，当你获取数据的时候，dispatch 函数会把信息发送到 reducer 函数。使用 dispatch 函数发送对象需要有一个必要的`type`属性跟一个可选的`payload`属性。类型(type)告诉了 reducer 函数需要转换哪个状态(state)，reducer 还能从载荷(payload)中提取新的状态(state)。毕竟，我们只有三个状态转换:初始化获取进程、通知数据获取成功的结果、并通知数据获取错误的结果。

在自定义 hook 的末尾，像以前一样返回状态，因为我们有一个状态对象而不是独立的状态，状态对象返回的是一个被破坏的对象。这样，调用 useDataApi 这个自定义 hook 仍然可以访问`data`、`isLoading`、`isError`。

```js
const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  ...

  const doFetch = url => {
    setUrl(url);
  };

  return { ...state, doFetch };
};
```

最后，同样重要的一点是，我们还没有实现 reducer 函数。它需要作用域三个不同的状态转化: `FETCH_INIT`、`FETCH_SUCCESS`、`FETCH_FAILURE`。每一个状态转换都需要返回一个新的状态(state)对象。让我们来看看如何使用 switch case 语句来实现这一点:

```js
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state };
    case "FETCH_SUCCESS":
      return { ...state };
    case "FETCH_FAILURE":
      return { ...state };
    default:
      throw new Error();
  }
};
```

reducer 函数可以通过参数访问当前状态和传入的操作。到目前为止，在 switch 里的 case 语句中，每个状态的转换只返回之前的状态。解构语句用于保持状态对象不可变 - 意味着状态(state)不能直接编译(mutated) - 执行最佳方案。现在，让我们覆盖一些当前状态返回的属性，以便在每次状态转换时修改状态:

```js
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};
```

现在，由 action 的 type 决定的每个状态转换都返回一个基于先前状态和可选的载荷(payload)的新状态。例如，在请求成功的情况下，载荷(payload)用于设置新状态对象的数据。

总之，Reducer Hook 确保了状态管理这一部分用自己的逻辑封装。通过提供 action 类型(type)和可选的载荷(payload)，你总会得到可预测的状态更改。另外，你永远不会遇到无效的状态。例如，以前你可能会意外地将`isLoading`和`isError`的状态设置为 true。在这种情况下，UI 应该显示什么？现在，由 reducer 函数定义的每个状态转换都会让另一个状态对象有效。

# 在 Effect Hook 中,中止数据获取

在 React 中，即使组件已经卸载，但组件的状态仍会被设置，这是一个常见的问题。(比如: React Router 的导航)。我之前写过这个问题，它描述了[如何防止在各种场景中为未挂载的组件设置状态](https://www.robinwieruch.de/react-warning-cant-call-setstate-on-an-unmounted-component/)。让我们看看如何防止在自定义 hook 中为数据获取设置状态。

```js
const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData
  });

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });

      try {
        const result = await axios(url);

        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [url]);

  const doFetch = url => {
    setUrl(url);
  };

  return { ...state, doFetch };
};
```

每一个 Effect Hook 都会带有一个 clean up 函数，它会在组件卸载的时候执行。clean up 函数式 hook 返回的一个功能。在我们的例子中，我们使用一个名为`didCancel`的标记来让我们的数据获取逻辑知道组件的状态(已挂载/已卸载)。如果组件已经卸载，标记应该设置为`true`，这将导致在最终异步解决后无法设置组件状态。

_Note: 实际上，数据获取并没有中止 - 这可以通过[Axios Cancellation](https://github.com/axios/axios#cancellation)来实现 - 但对于已卸载的组件，不再执行状态转换。由于 Axios Cancellation 在我看来并不是最好的 API，阻止状态设置的布尔值标记也能起到作用。_

你已经了解了如何在 React 中使用 state 和 effect hook 进行数据获取了。如果你对在使用 render props 和高阶组件的 class component(和 functional component)中获取数据感兴趣，你可以阅读我在文章开头提及到的文章。此外，我希望本文对学习 React Hooks 以及在实际场景中使用它们有所帮助。

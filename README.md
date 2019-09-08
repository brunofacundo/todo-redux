# Entendendo o Redux com hooks

Se você está agora por dentro do mundo do React já deve ter ouvido falar do termo Redux, mas a final o que é ele? para que ser? onde vive?

Vamos tentar responder algumas dessas perguntas nesse post.

# Quando usar o Redux

Vamos imaginar o seguinte caso, precisamos fazer com que um componente filho altere os dados de um componente pai.

Para isso vamos criar uma componente chamado **TodoList** e dentro dele vamos criar mais dois componentes chamados **Header** e **List** respetivamente.

_TodoList.js_

```js
import React, { useState } from 'react';
import Header from './Header';
import List from './List';

export default function TodoList() {
    const [list, setList] = useState([]);

    function onAdd(value) {
        setList([...list, value]);
    }

    function onRemove(index) {
        setList(list.filter((item, i) => i !== index));
    }

    return (
        <>
            <Header onAdd={onAdd} />
            <List list={list} onRemove={onRemove} />
        </>
    );
}
```

_Header.js_

```js
import React, { useState } from 'react';

export default function Header({ onAdd }) {
    const [value, setValue] = useState('');

    function handleAdd(e) {
        e.preventDefault();

        if (value.length > 0) {
            onAdd(value);
            setValue('');
        }
    }

    return (
        <form onSubmit={handleAdd}>
            <input type="text" value={value} onChange={e => setValue(e.target.value)} />
            <button type="submit">Add</button>
        </form>
    );
}
```

_List.js_

```js
import React from 'react';

export default function List({ list, onRemove }) {
    if (list.length === 0) {
        return <span>Todo list is empty :)</span>;
    }

    function handleRemove(index) {
        onRemove(index);
    }

    return (
        <ul>
            {list.map((item, index) => (
                <li key={index}>
                    <span>{item} </span>
                    <button type="button" onClick={() => handleRemove(index)}>
                        Remove
                    </button>
                </li>
            ))}
        </ul>
    );
}
```

O resultado será esse:

![Todo list](./assets/todo-list.gif)

Como podemos ver acima o componente **TodoList** tem um estado que é compartilhado com seus filhos e para que eles possam alterar esse estado é passado via propriedades um função de **callback**.

Agora digamos que se os componentes filhos acima também tenha outros componentes filhos que altere o estado do **TodoList**, teríamos que ficar passado o callback de um filho para outro e isso em um sistema grande acaba ficando complexo e de difícil manutenção com o tempo.

Então podemos definir alguns critérios para decidimos se devemos usar o redux:

-   Se o estado de um componente não tem "dono", ou seja o estado é compartilhado por vários componentes.
-   Se estado é manipulado por mais componentes.
-   Se as ações do usuário causam efeitos colaterais nos dados, ou seja se essa ação pode causa um efeito que altere outros componentes.

Pronto agora que definimos os critérios para usar o redux vamos entender o que é ele.

# O que é o Redux

É uma biblioteca que implementa a arquitetura **Flux** (_A arquitetura flux é uma formar de comunicação de vários elementos em tela_) e de forma bem resumida o redux é gerenciador de estados globais da aplicação. Podemos divido ele em 3 partes: **store**, **actions**, **reducers**.

## Store

Podemos pensar como sendo o local onde irar ficar salvo o estado global da aplicação. O store é um **objeto JavaScript**.

## Actions

Actions são responsáveis por solicitar a mudança de algo no **store**, eles devem ser uma **função pura** e retornar um **object JavaScript** e esse object deve ter pelos menos um atributo **type** definido.

## Reducers

Reducers são responsáveis receber as solicitações de mudança dos **actions** e alterar algum dado no store.

Vamos agora para a parte prática e adicionar o redux no nosso exemplo do começo do post.

# Configurando o Redux

#### Instalando o redux

Precisamos instalar duas dependências no nosso projeto o **redux** e o **react-redux**, para isso basta executar esse comando no terminal:

```sh
yarn add redux react-redux
```

ou

```sh
npm i --save redux react-redux
```

#### Configurando o store, actions e redurces

Agora vamos fazer a parte que dar um pouco mais de trabalho, mas que é a parte mais importante.

Começaremos criando uma pasta **store** e ela irá ter a seguinte estrutura:

![Estrutura pasta store](./assets/store-folder.png)

-   **modules**: Nessa pasta irá ficar todos os módulos da nossa aplicação. Modulo aqui seria um agrupamento de actions e redurces por entidade, por exemplo iremos ter módulo **todo**.

    -   **todo**: Nessa pasta irá ficar os arquivos de actions e reducer relacionados ao **todo**.

        -   **actions.js**: Arquivo com as actions do **todo**.
        -   **reducer.js**: Arquivo com o reducer do **todo**.

    -   **rootReducer.js**: Arquivo responsável por pegar os reducers de todos os módulos e combinar eles em um só.

-   **index.js**: Nesse arquivo vamos configurar o store da aplicação.

Vamos ver o conteúdo de cada arquivo acima.

_modules/todo/actions.js_

```js
export function addTodo(value) {
    return {
        type: '@todo/ADD_TODO',
        value
    };
}

export function removeTodo(index) {
    return {
        type: '@todo/REMOVE_TODO',
        index
    };
}
```

Aqui definimos e exportamos todos os actions relacionados a entidade **todo**, como falamos anteriormente eles devem ser funções puras e retorna um objeto javascript, onde obrigatoriamente tem que ter um atributo **type**.

_modules/todo/reducer.js_

```js
const initialState = [];

export default function todo(state = initialState, action) {
    switch (action.type) {
        case '@todo/ADD_TODO':
            return [...state, action.value];

        case '@todo/REMOVE_TODO':
            return state.filter((item, i) => i !== action.index);

        default:
            return state;
    }
}
```

No reducer exportamos apenas uma função, ela recebe o state atual e o action que foi disparado (é o mesmo objeto que retornamos nas funções do arquivo _actions.js_), dentro da função do reducer fizemos um switch para saber qual o action que estar sendo disparado naquele momento e retornamos um novo objeto com o state atualizado (não devemos altera o objeto state direto, sempre precisamos criar um novo).

_modules/rootReducer.js_

```js
import { combineReducers } from 'redux';

import todo from './todo/reducer';

export default combineReducers({
    todo
});
```

Aqui usamos uma função **combineReducers** do redux para combinar todos os nossos reducers em um objeto só. A medida que formos criado novos módulos, basta importa o reducer deles aqui e ir colocando dentro do objeto da função **combineReducers**.

_store/index.js_

```js
import { createStore } from 'redux';

import rootReducer from './modules/rootReducer';

export default createStore(rootReducer);
```

E por último usamos a função **createStore** também do redux, para criamos nosso store, passamos para ela os nossos reducers do arquivo _rootReducer.js_.

Pronto agora falta só conectar os nossos componentes.

#### Conectado os componentes no redux

Primeiro precisamos configurar o componente **Provider** do **react-redux** no nosso projeto. Esse componente deve fica por volta de toda a aplicação e ele recebe como propriedade o **store**. Para isso vamos criar um novo componente chamado **App** e colocar o **TodoList** dentro dele.

_App.js_

```js
import React from 'react';
import { Provider } from 'react-redux';

import TodoList from './components/TodoList';
import store from './store';

export default function App() {
    return (
        <Provider store={store}>
            <TodoList />
        </Provider>
    );
}
```

Podemos agora fazer uma pequena refatoração no componente **TodoList**

_TodoList.js_

```js
import React from 'react';
import Header from './Header';
import List from './List';

export default function TodoList() {
    return (
        <>
            <Header />
            <List />
        </>
    );
}
```

Aqui removemos todos aqueles callbacks e também as propriedades que passávamos para os componentes filhos.

Vamos refatorar também os componentes **Header** e **List**.

_Header.js_

```js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; // 👈

import { addTodo } from '../store/modules/todo/actions'; // 👈

export default function Header() {
    const dispatch = useDispatch(); // 👈
    const [value, setValue] = useState('');

    function handleAdd(e) {
        e.preventDefault();

        if (value.length > 0) {
            dispatch(addTodo(value)); // 👈
            setValue('');
        }
    }

    return (
        <form onSubmit={handleAdd}>
            <input type="text" value={value} onChange={e => setValue(e.target.value)} />
            <button type="submit">Add</button>
        </form>
    );
}
```

_List.js_

```js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // 👈

import { removeTodo } from '../store/modules/todo/actions'; // 👈

export default function List() {
    const dispatch = useDispatch(); // 👈
    const list = useSelector(state => state.todo); // 👈

    if (list.length === 0) {
        return <span>Todo list is empty :)</span>;
    }

    function handleRemove(index) {
        dispatch(removeTodo(index)); // 👈
    }

    return (
        <ul>
            {list.map((item, index) => (
                <li key={index}>
                    <span>{item} </span>
                    <button type="button" onClick={() => handleRemove(index)}>
                        Remove
                    </button>
                </li>
            ))}
        </ul>
    );
}
```

Aqui estamos usando dois hooks do react-redux o **useDispatch** e **useSelector**.

-   **useDispatch**: Esse hook retornar uma função que iremos usar quando quisemos disparado uma ação para os redurces, passando como parâmetro um **action**.
-   **useSelector**: Iremos usar esse hooks quando queremos ler algum dado do store, ele recebe como parâmetro uma função que irar ser chamada recebendo todo o estado atual da aplicação, devemos retorna aquilo que queremos ler.

# Conclusão

Embora pareça um pouco complexo e verboso no começo, o redux facilita muito na comunicação de vários componentes e uma vez que o seu entendimento seja alcançado, terá um ganho de produtividade considerável. Espero que tenha dado para entender um pouco sobre como o redux funciona.

Todo o código usado no exemplo estar disponível nesse repositório.

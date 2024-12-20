import { Request, Response } from "express";

const todos = [
    { id: 1, text: "Buy Milk", completedAt: new Date() },
    { id: 2, text: "Buy Bread", completedAt: null },
    { id: 3, text: "Buy Butter", completedAt: new Date() },
];

export class TodosController {
    //* Dependency Injection
    constructork() {}

    public getTodos = (req: Request, res: Response) => {
        res.json(todos);
        return;
    };

    public getTodoById = (req: Request, res: Response) => {
        // const id = req.params.id;
        const id = +req.params.id;
        if (isNaN(id))
            res.status(400).json({ error: `ID argument is not a number` });

        const todo = todos.find((todo) => todo.id === id);

        todo
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${id} not found` });
        // if (todo) {
        //     res.json(todo);
        //     return;
        // } else {
        //     res.status(404).json({ error: `TODO with id ${id} not found` });
        //     return;
        // }
    };

    public createTodo = (req: Request, res: Response) => {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ error: "Text property is required" });
            return;
        }

        const newTodo = {
            id: todos.length + 1,
            text: text,
            completedAt: null,
        };

        todos.push(newTodo);

        res.json(newTodo);
    };

    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            res.status(400).json({ error: `ID argument is not a number` });
            return;
        }

        const todo = todos.find((todo) => todo.id === id);
        if (!todo) {
            res.status(404).json({ error: `TODO with id ${id} not found` });
            return;
        }

        const { text, completedAt } = req.body;
        // if (!text) {
        //     res.status(400).json({ error: "Text property is required" });
        //     return;
        // }

        // Asignar un valor siempre y cuando venga mediante el body de la petición
        todo.text = text || todo.text;
        completedAt === "null"
            ? (todo.completedAt = null)
            : (todo.completedAt = new Date(completedAt || todo.completedAt));
        //! OJO Referencia
        // todos.forEach((todo, index) => {
        //     if (todo.id === id) {
        //         todos[index] = todo;
        //     }
        // });

        res.json(todo);
    };

    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            res.status(400).json({ error: `ID argument is not a number` });
            return;
        }

        const todo = todos.find((todo) => todo.id === id);
        if (!todo) {
            res.status(404).json({ error: `TODO with id ${id} not found` });
            return;
        }

        // const result = todos.filter((todo) => todo.id != id);
        todos.splice(todos.indexOf(todo), 1);
        res.json(todo);
    };
}

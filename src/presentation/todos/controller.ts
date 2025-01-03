import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";

export class TodosController {
    //* Dependency Injection
    constructork() {}

    public getTodos = async (req: Request, res: Response) => {
        const todos = await prisma.todo.findMany();
        res.json(todos);
        return;
    };

    public getTodoById = async (req: Request, res: Response) => {
        // const id = req.params.id;
        const id = +req.params.id;
        if (isNaN(id))
            res.status(400).json({ error: `ID argument is not a number` });

        const todo = await prisma.todo.findFirst({
            where: { id },
        });
        // const todo = todos.find((todo) => todo.id === id);

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

    public createTodo = async (req: Request, res: Response) => {
        // const { text } = req.body
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const todo = await prisma.todo.create({
            data: createTodoDto!,
        });

        // const newTodo = {
        //     id: todos.length + 1,
        //     text: text,
        //     completedAt: null,
        // };

        // todos.push(newTodo);

        res.json(todo);
    };

    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({
            ...req.body,
            id,
        });

        if (error) {
            res.status(400).json({ error });
            return;
        }

        const todo = await prisma.todo.findFirst({
            where: {
                id: id,
            },
        });

        if (!todo) {
            res.status(404).json({ error: `TODO with id ${id} not found` });
            return;
        }

        const updateTodo = await prisma.todo.update({
            where: { id },
            data: updateTodoDto!.values,
        });

        res.json(updateTodo);
        return;
    };

    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            res.status(400).json({ error: `ID argument is not a number` });
            return;
        }

        // const todo = todos.find((todo) => todo.id === id);
        // const todo = await prisma.todo.findMany({
        //     where: {
        //         id: id,
        //     },
        // });

        // if (!todo) {
        //     res.status(404).json({ error: `TODO with id ${id} not found` });
        //     return;
        // }

        // const result = todos.filter((todo) => todo.id != id);
        // todos.splice(todos.indexOf(todo), 1);
        const todo = await prisma.todo.findFirst({
            where: {
                id: id,
            },
        });

        if (!todo) {
            res.status(404).json({ error: `TODO with id ${id} not found` });
            return;
        }

        const deleted = await prisma.todo.delete({
            where: { id },
        });

        deleted
            ? res.json(deleted)
            : res.status(400).json({ error: `TODO with if $[id] not found` });
    };
}


import {Item} from "./Item";

export class ItemRepository
{
    private items : Item[];

    public constructor()
    {
        this.items = [];
    }

    public all(): Item[]
    {
        return this.items;
    }

    public add(item: Item): void
    {
        this.items.push(item);
    }

    public remove(item: Item): void
    {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1);
    }

    public length(): number
    {
        return this.items.length;
    }

    public get(index: number) :Item
    {
        return this.items[index];
    }
}
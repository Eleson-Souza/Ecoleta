import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController {

    async index(request: Request, response: Response) {
        // cidade, uf, items (Query Params)
        const {city, uf, items} = request.query;

        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                id: point.id,
                title: point.name,
                latitude: point.latitude,
                longitude: point.longitude,
                image: `http://localhost:3333/uploads/${point.image}`,
                image_url: `http://192.168.100.67:3333/uploads/${point.image}`
            }
        });

        return response.json(serializedPoints);
    }

    async show(request: Request, response: Response) {
        const {id} = request.params;

        const point = await knex('points').where('id', id).first();
        
        if(!point) {
            return response.status(400).json({message: 'Point not found.'});
        }

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.100.67:3333/uploads/${point.image}`
        }

        /*
            SELECT * FROM items
            JOIN point_items ON items.id = point_items.items_id
            WHERE point_items.point_id = {id}
        */
        const items = await knex('items')
            .select('items.title')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id);

        return response.json({point: serializedPoint, items});
    }

    async create(request: Request, response: Response) {
        const {
            name, 
            email, 
            whatsapp, 
            latitude, 
            longitude, 
            city, 
            uf, 
            items
        } = request.body;
    
        // Não permite seja executada uma query, caso alguma delas dê um erro. Ou seja, apenas serão efetivadas no banco de fato, se todos os comando sql funcionarem.
        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            name, 
            email, 
            whatsapp, 
            latitude, 
            longitude, 
            city, 
            uf
        }
    
        const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0];
    
        const pointItems = items
            .split(',')
            .map((item: String) => Number(item.trim()))
            .map((item_id: number) => {
            return {
                item_id,
                point_id
            }
        });
    
        await trx('point_items').insert(pointItems);

        trx.commit();
    
        response.json({
            id: point_id,
            ...point
        });
    }

}

export default PointsController;
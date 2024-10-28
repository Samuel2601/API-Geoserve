/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {Injectable, CanActivate, ExecutionContext, BadRequestException} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {getMetadataArgsStorage} from 'typeorm';

@Injectable()
export class DynamicQueryValidationGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const {query} = request;
		const handler = context.getHandler();
		const entityClass = this.reflector.get<Function>('entity', handler);

		if (!entityClass) {
			throw new BadRequestException('Entity class not specified for this route');
		}

		// Validar el parámetro 'filter'
		if (query.filter) {
			try {
				JSON.parse(query.filter);
			} catch (e) {
				throw new BadRequestException('El parámetro "filter" debe ser un JSON válido');
			}
		}

		// Validar el parámetro 'relations'
		if (query.relations) {
			if (typeof query.relations !== 'string') {
				throw new BadRequestException('El parámetro "relations" debe ser una cadena de texto');
			}

			const allowedRelations = this.getEntityRelations(entityClass);
			const requestedRelations = query.relations.split(',');

			for (const relation of requestedRelations) {
				if (!allowedRelations.includes(relation)) {
					throw new BadRequestException(`La relación "${relation}" no está permitida para esta entidad`);
				}
			}
		}

		return true;
	}

	private getEntityRelations(entityClass: Function): string[] {
		const metadata = getMetadataArgsStorage();
		const relations = metadata.relations.filter((relation) => relation.target === entityClass);
		return relations.map((relation) => relation.propertyName);
	}
}

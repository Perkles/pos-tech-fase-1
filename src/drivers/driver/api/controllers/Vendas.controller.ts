import {Request, Response} from 'express';
import { DomainException } from '../../../../core/domain/base/Domain.exception';
import { PedidoMapperApi } from '../mappers/Pedido.mapper.api';
import { UseCaseException } from '../../../../adapters/exceptions/UseCase.exception';
import { PedidoRepository } from '../../../../core/applications/ports/Pedido.repository';
import { VendasAdapterController } from '../../../../adapters/controllers/Vendas.controller';
import { FilaPedidosRepository } from '../../../../core/applications/ports/FilaPedidos.repository';

export class VendasApiController {
    
    constructor(private readonly pedidoRepository: PedidoRepository, readonly filaPedidoRepository: FilaPedidosRepository) {} 

    async callbackHook(request: Request, response: Response) {
        try{
            await VendasAdapterController.atualizaStatusPagamentoCallbackHook(PedidoMapperApi.requestToPedidoCallbackDto(request), this.pedidoRepository, this.filaPedidoRepository)
            response.status(200).json({message: "Pedido atualizado"})
        }catch(error){
            if(error instanceof DomainException || error instanceof UseCaseException){
                response.status(400).json({ message: error.message })
            }else {
                response.status(400).json({ message: "Falha ao cadastrar produto" })
            }
        }
    }
}
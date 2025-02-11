import assert                from 'node:assert/strict'
import { describe }          from 'node:test'
import { it }                from 'node:test'

import { CommandBus }        from '@nestjs/cqrs'
import { CqrsModule }        from '@nestjs/cqrs'
import { EventBus }          from '@nestjs/cqrs'
import { EventPublisher }    from '@nestjs/cqrs'
import { QueryBus }          from '@nestjs/cqrs'
import { Test }              from '@nestjs/testing'

import { CqrsAdapterModule } from './cqrs-adapter.module.js'

describe('Files CqrsAdapterModule', () => {
  it('should initialize all providers correctly', async () => {
    const testingModule = await Test.createTestingModule({
      imports: [CqrsAdapterModule.register()],
    }).compile()

    assert.ok(testingModule.get(CqrsModule), 'CqrsModule should be provided')
    assert.ok(testingModule.get(EventPublisher), 'EventPublisher should be provided')
    assert.ok(testingModule.get(EventBus), 'EventBus should be provided')
    assert.ok(testingModule.get(QueryBus), 'QueryBus should be provided')
    assert.ok(testingModule.get(CommandBus), 'CommandBus should be provided')
  })
})
